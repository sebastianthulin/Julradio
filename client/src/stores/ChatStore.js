const { EventEmitter } = require('events')
const socket = require('../services/socket')
const request = require('superagent')
const User = require('../services/User')
const UserStore = require('./UserStore')
const ShitStore = require('./ShitStore')
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
    conversation && ShitStore.clear('message', conversation._id)
    state.targetUser = user
    updateMessages()

    if (conversation && !conversation.loaded) {
      ChatStore.load()
    }
  })
}

ChatStore.load = function(callback) {
  const chatId = ChatStore.getConversationId()
  const conversation = threadsById[chatId]
  let messageIds

  if (conversation.loaded) {
    messageIds = messageIdsByThreadId[chatId]
    conversation.offset += 50
  } else {
    messageIds = messageIdsByThreadId[chatId] = []
    conversation.offset = 0
  }

  request.get(`/api/chat/${chatId}/${conversation.offset}`, function(err, { body: messages }) {
    if (err) {
      return console.error('Couldn\'t load conversation', err)
    }

    let i = messages.length
    while (i--) {
      const message = messages[i]
      message.date = new Date(message.date)
      messageIds.push(message._id)
      messagesById[message._id] = message
    }
    conversation.loaded = true
    messageIds.sort((a, b) => messagesById[a].date - messagesById[b].date)
    callback && callback()
    updateMessages()
  })
}

ChatStore.deselect = function() {
  state.messages = []
  state.targetUser = null
  push()
}

ChatStore.sendMessage = function(text) {
  return NotificationStore.error({value: 'CHAT_DISABLED'})
  socket.emit('chat:message', {
    text,
    userId: state.targetUser._id,
    conversationId: ChatStore.getConversationId()
  }, function() {
    NotificationStore.error({type: 'message'})
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
  const messageIds = messageIdsByThreadId[chatId]
  const conversation = threadsById[chatId] = threadsById[chatId] || {}
  message.date = new Date(message.date)
  messageIds && messageIds.push(message._id)
  messagesById[message._id] = message
  conversation.lastMessage = message
  conversation.updatedAt = message.date
  conversation.loaded && conversation.offset++
  updateThreads()
  updateMessages()
  if (!messageIds && chatId === ChatStore.getConversationId()) {
    ChatStore.load()
  }
})

socket.on('chat:conversation', function(conv) {
  insertConversation(conv)
  updateThreads()
  push()
})

ShitStore.on('message', conversationId =>
  ChatStore.getConversationId() === conversationId && document.hasFocus())

document.addEventListener('focus', () =>
  ShitStore.clear('message', ChatStore.getConversationId()))

ChatStore.fetch = function() {
  request.get('/api/chat', function(err, { body: conversations }) {
    conversations.forEach(insertConversation)
    state.loaded = true
    updateThreads()
    ChatStore.emit('ready')
  })
}

module.exports = ChatStore