'use strict';

const db = require('./models')
const io = require('../server').io
const mongoose = require('mongoose')

// Reddan: 5605456bfef38acf1f4a511b
// Glutch: 5611bdfdf1695c94128309a8

module.exports = function(socket) {
  var uid = socket.request.session.uid
  if (!uid) return

  socket.join(uid)

  function createConversation(users) {
    var conv = new db.Conversation({ users })
    conv.populate('users', function(err, doc) {
      users.forEach(function(userId) {
        io.to(userId).emit('chat:conversation', doc)
      })
    })
    return conv.save()
  }

  function getConversationId(userId) {
    var users
    return new Promise(function(resolve, reject) {
      db.User.findById(userId).exec().then(function(user) {
        if (!user || user._id.toString() === uid.toString()) {
          throw new Error('invalid user')
        }
        users = [uid, user._id]
        return db.Conversation.findOne({$and: [
          {users: uid},
          {users: user._id}
        ]}).exec()
      }).then(function(conversation) {
        if (conversation) {
          return conversation
        } else {
          return createConversation(users)
        }
      }).then(function(conversation) {
        resolve(conversation._id)
      }, reject)
    })
  }

  function sendMessage(conversationId, text) {
    db.Conversation.findById(conversationId).exec().then(function(conversation) {
      if (!conversation) {
        // errors do not seem to get caught
        throw new Error('conversation not found')
      } else if (conversation.users.indexOf(uid) === -1) {
        throw new Error('not authorised')
      }

      const message = new db.Message({
        text,
        user: uid,
        conversation: conversationId
      })

      message.save()
      conversation.lastMessage = message._id
      conversation.updatedAt = Date.now()
      conversation.save()
      conversation.users.forEach(function(userId) {
        io.to(userId).emit('chat:message', message)
      })
    }, function(err) {
      console.log(err)
    })
  }

  socket.on('chat:message', function(opts) {
    if (!opts.text) {
      return
    }

    if (opts.conversationId) {
      sendMessage(opts.conversationId, opts.text)
    } else if (opts.userId) {
      getConversationId(opts.userId).then(function(conversationId) {
        sendMessage(conversationId, opts.text)
      }).catch(function(err) {
        console.log('err', err)
      })
    }
  })
}