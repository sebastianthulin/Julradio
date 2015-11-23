'use strict';

const db = require('../models')
const io = require('../../server').io
const Notify = require('../services/Notify')
const Blockages = require('../services/Blockages')
const performAction = require('../services/performAction')

function createConversation(users) {
  var conv = new db.Conversation({ users })
  conv.populate('users', function(err, doc) {
    users.forEach(function(userId) {
      io.to(userId).emit('chat:conversation', doc)
    })
  })
  return conv.save()
}

function getConversationId(from, targetUserId) {
  return db.User.findById(targetUserId).exec().then(function(user) {
    if (!user || user._id.toString() === from) {
      throw new Error('invalid user')
    }
    return db.Conversation.findOne({$and: [
      {users: from},
      {users: user._id}
    ]}).exec()
  }).then(function(conversation) {
    if (conversation) {
      return conversation
    } else {
      return createConversation([from, targetUserId])
    }
  }).then(function(conversation) {
    return conversation._id
  })
}

function sendMessage(from, conversationId, text) {
  return db.Conversation.findById(conversationId).exec().then(function(conversation) {
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
  }).then(function(data) {
    data[1].users.forEach(function(userId) {
      io.to(userId).emit('chat:message', data[0])
      if (from != userId) {
        Notify({
          userId,
          from,
          type: 'message',
          value: conversationId
        })
      }
    })
  })
}

function chatHandler(socket) {
  const ip = socket.request.connection.remoteAddress || socket.request['x-forwarded-for']
  socket.on('chat:message', function(opts, errHandler) {
    if (typeof opts !== 'object' || !opts.text) return
    Promise.all([
      performAction(ip, 'chat'),
      Blockages.confirm(socket.uid, opts.userId)
    ]).then(function() {
      return opts.conversationId || getConversationId(socket.uid, opts.userId)
    }).then(function(conversationId) {
      return sendMessage(socket.uid, conversationId, opts.text)
    }).catch(function(err) {
      console.error('@chatHandler', err)
      errHandler && errHandler()
    })
  })
}

module.exports = chatHandler