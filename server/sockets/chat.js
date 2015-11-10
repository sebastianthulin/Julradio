'use strict';

const db = require('../models')
const io = require('../../server').io
const Notify = require('../services/Notify')
const getBlockage = require('../services/getBlockage')

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

    message.save()
    conversation.lastMessage = message._id
    conversation.updatedAt = Date.now()
    conversation.save()
    conversation.users.forEach(function(userId) {
      io.to(userId).emit('chat:message', message)
      Notify({
        userId,
        from,
        type: 'message',
        value: conversationId
      })
    })
  })
}

function chatHandler(socket) {
  socket.on('chat:message', function(opts) {
    if (typeof opts !== 'object' || !opts.text) return
    getBlockage(socket.uid, opts.userId).then(function(relationship) {
      if (relationship) {
        throw new Error('blocked')
      }
      return opts.conversationId || getConversationId(socket.uid, opts.userId)
    }).then(function(conversationId) {
      return sendMessage(socket.uid, conversationId, opts.text)
    }).catch(function(err) {
      console.log('@chat:message handler', err)
    })
  })
}

module.exports = chatHandler