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

    const conversation = threadsByUserId[user._id]
    conversation && NotificationStore.clear('message', conversation._id)
    state.targetUser = user
    updateMessages()

    if (conversation && !conversation.loaded) {
      ChatStore.load()
    }
  })
}

ChatStore.load = function() {
  const chatId = ChatStore.getConversationId()
  const conversation = threadsById[chatId]
  var messageIds

  if (conversation.loaded) {
    messageIds = messageIdsByThreadId[chatId]
    conversation.offset += 50
  } else {
    messageIds = messageIdsByThreadId[chatId] = []
    conversation.offset = 0
  }

  request.get(`/api/chat/${chatId}/${conversation.offset}`).then(function({ body: messages }) {
    var i = messages.length
    while (i--) {
      var message = messages[i]
      message.date = new Date(message.date)
      messageIds.push(message._id)
      messagesById[message._id] = message
    }
    conversation.loaded = true
    messageIds.sort((a, b) => messagesById[a].date - messagesById[b].date)
    updateMessages()
  }, function(err) {
    console.log('Couldn\'t load conversation', err)
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
    userId: state.targetUser._id,
    conversationId: ChatStore.getConversationId()
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
  state.threads.sort((a, b) => b.updatedAt - a.updatedAt)
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
    updatedAt: new Date(conv.updatedAt),
    offset: 0
  }
  UserStore.insert(conversation.user)
  threadsById[conversation._id] = conversation
  threadsByUserId[conversation.user._id] = conversation
  threadIds.push(conversation._id)
}

socket.on('chat:message', function(message) {
  const chatId = message.conversation
  message.date = new Date(message.date)
  messagesById[message._id] = message
  messageIdsByThreadId[chatId] = messageIdsByThreadId[chatId] || []
  messageIdsByThreadId[chatId].push(message._id)
  const conversation = threadsById[chatId] = threadsById[chatId] || {}
  conversation.lastMessage = message
  conversation.updatedAt = message.date
  conversation.loaded && conversation.offset++
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