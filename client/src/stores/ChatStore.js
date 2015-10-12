const { EventEmitter } = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const UserStore = require('./UserStore')
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
    state.targetUser = user
    updateMessages()

    if (!thread || thread.loaded) {
      return
    }

    request.get(`/api/chat/${thread._id}`).then(function({ body: messages }) {
      messages.sort((a, b) => new Date(b.date) - new Date(a.date))
      const messageIds = messageIdsByThreadId[thread._id] = []
      var i = messages.length
      while (i--) {
        var msg = messages[i]
        messageIds.push(msg._id)
        messagesById[msg._id] = msg
      }
      updateMessages()
    }, function(err) {
      console.log('Couldn\'t select conversation', err)
    })
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
    userId: state.targetUser && state.targetUser._id
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
  const uid = UserStore.get()._id
  const conversation = {
    _id: conv._id,
    user: conv.users.filter(user => user._id !== uid)[0],
    lastMessage: conv.lastMessage,
    loaded: false,
    unread: false,
    updatedAt: conv.updatedAt
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
  threadsById[chatId] = threadsById[chatId] || {}
  threadsById[chatId].lastMessage = message
  threadsById[chatId].updatedAt = Date.now()
  updateThreads()
  updateMessages()
})

socket.on('chat:conversation', function(conv) {
  insertConversation(conv)
  updateThreads()
  push()
})

request.get('/api/chat').then(function({ body: conversations }) {
  conversations.forEach(insertConversation)
  state.loaded = true
  updateThreads()
  // push()
  ChatStore.emit('ready')
}, function(err) {
  console.log('could not load messages')
})

module.exports = ChatStore