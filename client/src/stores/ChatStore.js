const { EventEmitter } = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const UserStore = require('./UserStore')
const ChatStore = new EventEmitter
const threadsById = {}
const messageIdsByThreadIds = {}
const messagesById = {}

const state = {
  loaded: false,
  selectedThreadId: null,
  threads: [],
  messages: []
}

function getMessages(chatId) {
  return messageIdsByThreadIds[chatId].map(id => messagesById[id])
  // correct the order of messages by ordering by date?
}

function updateState() {
  if (state.selectedThreadId) {
    state.messages = getMessages(state.selectedThreadId)
  } else {
    state.messages = []
  }
  // ChatStore.emit('messages', state.messages)
  ChatStore.emit('state', state)
}

ChatStore.sendMessage = function(text, chatId) {
  const id = Math.random().toString(36).substr(2)
  const message = { text, conversationId: chatId }
  messagesById[id] = message
  messageIdsByThreadIds[chatId].push(id)
  socket.emit('chat:message', message)
  request.post('/api/chat', message).then(function(res) {
    // Succes...
  }, function(err) {
    // tell the user that the message failed
    console.log(err)
  })
  message.id = id
  message.user = UserStore.get()
  updateState()
}

ChatStore.select = function(chatId) {
  if (!Number(chatId)) {
    state.selectedThreadId = null
    updateState()
    return
  }

  state.selectedThreadId = chatId
  if (!messageIdsByThreadIds[chatId]) {
    request.get(`/api/chat/${chatId}`).then(function(res) {
      const messages = res.body
      var i = messages.length
      while (i--) {
        messagesById[messages[i].id] = messages[i]
      }
      messageIdsByThreadIds[chatId] = messages.map(msg => msg.id)
      updateState()
    }, function(err) {
      console.log('err', err)
    })
  } else {
    updateState()
  }
}

ChatStore.subscribe = function(handler) {
  handler(state)
  ChatStore.on('state', handler)
  return function unsubscribe() {
    ChatStore.removeListener('state', handler)
  }
}

ChatStore.onReady = function(handler) {
  if (state.loaded) {
    handler()
  } else {
    var fn = function() {
      handler()
      ChatStore.removeListener('ready', fn)
    }
    ChatStore.on('ready', fn)
  }
}

socket.on('chat:message', function(message) {
  messagesById[message.id] = message
  if (messageIdsByThreadIds[message.chatId]) {
    messageIdsByThreadIds[message.chatId].push(message.id)
    updateState()
  }
})

request.get('/api/chat').then(function(res) {
  const uid = UserStore.get().id
  const conversations = res.body.map(conv => ({
    id: conv.id,
    user: conv.users.filter(user => user.id !== uid)[0],
    lastMessage: conv.lastMessage,
    loaded: false,
    messageIds: [],
    unread: false
  }))

  var i = conversations.length
  while (i--) {
    threadsById[conversations[i].id] = conversations[i]
  }

  state.threads = conversations
  state.loaded = true
  ChatStore.emit('state', state)
  ChatStore.emit('ready')
}, function(err) {
  console.log('could not load messages')
})

module.exports = ChatStore