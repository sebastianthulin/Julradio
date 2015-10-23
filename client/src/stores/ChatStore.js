const { EventEmitter } = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const User = require('../services/User')
const Sound = require('../services/Sound')
const UserStore = require('./UserStore')
const NotificationStore = require('./NotificationStore')
const ChatStore = new EventEmitter
const threadsById = {}
const threadsByUserId = {}
const messageIdsByThreadId = {}
const messagesById = {}
const threadIds = []

const state = {
  loaded: false,
  targetUser: null,
  messages: [],
  threads: []
}

ChatStore.select = function(username) {
  UserStore.getByUsername(username, function(user) {
    if (!user) {
      return ChatStore.deselect()
    }

    const thread = threadsByUserId[user._id]
    thread && NotificationStore.clear('message', thread._id)
    state.targetUser = user
    updateMessages()

    if (!thread || thread.loaded) {
      return
    }

    request.get(`/api/chat/${thread._id}/0`).then(function({ body: messages }) {
      messages.sort((a, b) => new Date(b.date) - new Date(a.date))
      const messageIds = messageIdsByThreadId[thread._id] = []
      var i = messages.length
      while (i--) {
        var msg = messages[i]
        messageIds.push(msg._id)
        messagesById[msg._id] = msg
      }
      updateMessages()
      thread.loaded = true
      thread.offset = 0
    }, function(err) {
      console.log('Couldn\'t select conversation', err)
    })
  })
}

ChatStore.load = function() {
  const convoId = ChatStore.getConversationId()
  const messageIds = messageIdsByThreadId[convoId]
  const conv = threadsById[convoId]
  conv.offset += 50
  request.get(`/api/chat/${convoId}/${conv.offset}`).then(function({ body: messages }) {
    var i = messages.length
    while (i--) {
      var msg = messages[i]
      messageIds.push(msg._id)
      messagesById[msg._id] = msg
    }
    messageIds.sort((a, b) => new Date(messagesById[a].date) - new Date(messagesById[b].date))
    updateMessages()
  }, function(err) {
    console.log('Couldn\'t select conversation', err)
  })
}

ChatStore.deselect = function() {
  state.messages = []
  state.targetUser = null
  push()
}

ChatStore.sendMessage = function(text) {
  socket.emit('chat:message', {
    text,
    conversationId: ChatStore.getConversationId(),
    userId: state.targetUser._id
  })
}

ChatStore.subscribe = function(handler) {
  handler(state)
  ChatStore.on('state', handler)
  return function unsubscribe() {
    ChatStore.removeListener('state', handler)
  }
}

ChatStore.onReady = handler => state.loaded ? handler() : ChatStore.once('ready', handler)

ChatStore.getConversationId = () => (threadsByUserId[state.targetUser && state.targetUser._id] || {})._id

const push = () => ChatStore.emit('state', state)

function updateThreads() {
  state.threads = threadIds.map(id => threadsById[id])
  state.threads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

function updateMessages() {
  const messageIds = messageIdsByThreadId[ChatStore.getConversationId()]
  state.messages = messageIds ? messageIds.map(id => messagesById[id]) : []
  push()
}

function insertConversation(conv) {
  const uid = User.get()._id
  const conversation = {
    _id: conv._id,
    user: conv.users.filter(user => user._id !== uid)[0],
    lastMessage: conv.lastMessage,
    loaded: false,
    unread: false,
    updatedAt: conv.updatedAt,
    offset: 0
  }
  UserStore.insert(conversation.user)
  threadsById[conversation._id] = conversation
  threadsByUserId[conversation.user._id] = conversation
  threadIds.push(conversation._id)
}

socket.on('chat:message', function(message) {
  const chatId = message.conversation
  messagesById[message._id] = message
  messageIdsByThreadId[chatId] = messageIdsByThreadId[chatId] || []
  messageIdsByThreadId[chatId].push(message._id)
  const conv = threadsById[chatId] = threadsById[chatId] || {}
  conv.lastMessage = message
  conv.updatedAt = Date.now()
  conv.offset++
  updateThreads()
  updateMessages()
})

socket.on('chat:conversation', function(conv) {
  insertConversation(conv)
  updateThreads()
  push()
})

NotificationStore.on('message', function(conversationId) {
  if (ChatStore.getConversationId() !== conversationId || !document.hasFocus()) {
    Sound.play('bells')
    return true
  }
  return false
})

document.addEventListener('focus', function() {
  NotificationStore.clear('message', ChatStore.getConversationId())
})

request.get('/api/chat').then(function({ body: conversations }) {
  conversations.forEach(insertConversation)
  state.loaded = true
  updateThreads()
  ChatStore.emit('ready')
}, function(err) {
  console.log('could not load messages')
})

module.exports = ChatStore