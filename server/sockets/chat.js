'use strict'

const {io} = require('../server')
const {Conversation, Message, User} = require('../models')
const {apiError} = require('../utils/apiError')
const {performAction, notify, blockages} = require('../utils/userUtils')
const {SAFE_USER_SELECT} = require('../constants')

const createConversation = async users => {
  const conv = await new Conversation({users}).save()
  const populated = await Conversation.findById(conv._id).populate({path: 'users', select: SAFE_USER_SELECT}).lean()
  users.forEach(userId => {
    io.to(userId).emit('chat:conversation', populated)
  })
  return conv
}

const getConversation = async (from, targetUserId) => {
  const user = await User.findById(targetUserId).lean()
  if (!user || user._id.toString() === from) {
    throw apiError('invalid user')
  }
  const conversation = await Conversation.findOne({$and: [
    {users: from},
    {users: user._id}
  ]})
  if (conversation) {
    return conversation
  }
  return createConversation([from, targetUserId])
}

const sendMessage = async (from, text, conversation) => {
  const message = new Message({
    text,
    user: from,
    conversation: conversation._id
  })

  conversation.lastMessage = message._id
  conversation.updatedAt = Date.now()

  await Promise.all([
    message.save(),
    conversation.save()
  ])

  conversation.users.forEach(userId => {
    userId = userId.toString()
    io.to(userId).emit('chat:message', message)
    if (userId !== from) {
      notify({
        userId,
        from,
        type: 'message',
        value: conversation._id
      })
    }
  })
}

const chatHandler = socket => {
  socket.on('chat:message', async (opts, errHandler) => {
    try {
      await Promise.all([
        performAction(socket.ip, 'chat'),
        blockages.confirm(socket.userId, opts.userId)
      ])
      const conversation = await getConversation(socket.userId, opts.userId)
      await sendMessage(socket.userId, opts.text, conversation)
    } catch (err) {
      if (!err.isApiError) {
        console.error('@chatHandler', err)
        err = apiError('UNKNOWN_ERROR')
      }
      errHandler && errHandler(err)
    }
  })
}

module.exports = chatHandler
