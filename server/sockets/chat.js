'use strict'

const db = require('../models')
const {io} = require('../server')
const {performAction, notify, blockages} = require('../utils/userUtils')

const createConversation = users => {
  let conv = new db.Conversation({users})
  conv.populate({path: 'users', select: '-hash -email'}, (err, doc) => {
    users.forEach(userId => {
      io.to(userId).emit('chat:conversation', doc)
    })
  })
  return conv.save()
}

const getConversationId = (from, targetUserId) => {
  return db.User.findById(targetUserId).exec().then(user => {
    if (!user || user._id.toString() === from) {
      throw new Error('invalid user')
    }
    return db.Conversation.findOne({$and: [
      {users: from},
      {users: user._id}
    ]}).exec()
  }).then(conversation => {
    if (conversation) {
      return conversation
    } else {
      return createConversation([from, targetUserId])
    }
  }).then(conversation => {
    return conversation._id
  })
}

const sendMessage = (from, conversationId, text) => {
  return db.Conversation.findById(conversationId).exec().then(conversation => {
    if (!conversation) {
      throw new Error('conversation not found')
    } else if (conversation.users.indexOf(from) === -1) {
      throw new Error('unauthorised')
    }

    const message = new db.Message({
      text,
      user: from,
      conversation: conversationId
    })

    conversation.lastMessage = message._id
    conversation.updatedAt = Date.now()

    return Promise.all([
      message.save(),
      conversation.save()
    ])
  }).then(data => {
    data[1].users.forEach(userId => {
      io.to(userId).emit('chat:message', data[0])
      if (from != userId) {
        notify({
          userId,
          from,
          type: 'message',
          value: conversationId
        })
      }
    })
  })
}

const chatHandler = socket => {
  socket.on('chat:message', (opts, errHandler) => {
    if (typeof opts !== 'object' || !opts.text) return
    Promise.all([
      performAction(socket.ip, 'chat'),
      blockages.confirm(socket.userId, opts.userId)
    ]).then(() => {
      return opts.conversationId || getConversationId(socket.userId, opts.userId)
    }).then(conversationId => {
      return sendMessage(socket.userId, conversationId, opts.text)
    }).catch(err => {
      console.error('@chatHandler', err)
      errHandler && errHandler()
    })
  })
}

module.exports = chatHandler
