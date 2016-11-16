const {EventEmitter} = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const handleNotification = require('../services/handleNotification')
const ChatStore = new EventEmitter
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

ChatStore.select = (username, cb) => {
  request.get(`/api/user/byname/${username}`).then(({body: user}) => {
    if (!user) {
      return ChatStore.deselect()
    }

    const conversation = threadsByUserId[user._id]
    state.targetUser = user
    conversation && cb()  // getConversationId() will return the selected conversation's id at this point
    updateMessages()

    if (conversation && !conversation.loaded) {
      ChatStore.load()
    }
  })
}

ChatStore.load = callback => {
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

  request.get(`/api/chat/${chatId}/${conversation.offset}`, (err, {body: messages}) => {
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

ChatStore.deselect = () => {
  state.messages = []
  state.targetUser = null
  push()
}

ChatStore.sendMessage = (text, handleError) => {
  socket.emit('chat:message', {
    text,
    userId: state.targetUser._id,
    conversationId: ChatStore.getConversationId()
  }, handleError)
}

ChatStore.subscribe = handler => {
  handler(state)
  ChatStore.on('state', handler)
  return () => {
    ChatStore.removeListener('state', handler)
  }
}

ChatStore.onReady = handler => state.loaded ? handler() : ChatStore.once('ready', handler)

ChatStore.getConversationId = () => (threadsByUserId[state.targetUser && state.targetUser._id] || {})._id

const push = () => ChatStore.emit('state', state)

const updateThreads = () => {
  state.threads = threadIds.map(id => threadsById[id])
  state.threads.sort((a, b) => b.updatedAt - a.updatedAt)
}

const updateMessages = () => {
  const messageIds = messageIdsByThreadId[ChatStore.getConversationId()]
  state.messages = messageIds ? messageIds.map(id => messagesById[id]) : []
  push()
}

const insertConversation = conv => {
  const userId = window.__USER__._id
  const conversation = {
    _id: conv._id,
    user: conv.users.filter(user => user._id !== userId)[0],
    lastMessage: conv.lastMessage,
    loaded: false,
    updatedAt: new Date(conv.updatedAt),
    offset: 0
  }
  threadsById[conversation._id] = conversation
  threadsByUserId[conversation.user._id] = conversation
  threadIds.push(conversation._id)
}

socket.on('chat:message', message => {
  const chatId = message.conversation
  const messageIds = messageIdsByThreadId[chatId]
  const conversation = threadsById[chatId] = threadsById[chatId] || {}
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

socket.on('chat:conversation', conv => {
  insertConversation(conv)
  updateThreads()
  push()
})

handleNotification.on('message', conversationId => {
  return ChatStore.getConversationId() === conversationId && document.hasFocus()
})

ChatStore.fetch = () => {
  request.get('/api/chat', (err, {body: conversations}) => {
    conversations.forEach(insertConversation)
    state.loaded = true
    updateThreads()
    ChatStore.emit('ready')
  })
}

if (window.__USER__) {
  ChatStore.fetch()
}

module.exports = ChatStore
