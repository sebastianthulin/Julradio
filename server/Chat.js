'use strict';

const db = require('./models')
const io = require('../server').io

const Notification = require('./Notification')
const getBlockage = require('./getBlockage')

module.exports = function(socket) {
  const uid = socket.request.session.uid
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
    return db.User.findById(userId).exec().then(function(user) {
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
      return conversation._id
    })
  }

  function sendMessage(conversationId, text) {
    db.Conversation.findById(conversationId).exec().then(function(conversation) {
      if (!conversation) {
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
        Notification('message', userId, message)
      })
    }).catch(function(err) {
      console.log('@sendMessage', err)
    })
  }

  socket.on('chat:message', function(opts) {
    if (typeof opts !== 'object' || !opts.text) {
      return
    }

    if (opts.conversationId) {
      sendMessage(opts.conversationId, opts.text)
    } else if (opts.userId) {
      getBlockage(uid, opts.userId).then(function(relationship) {
        if (!relationship) {
          getConversationId(opts.userId).then(function(conversationId) {
            sendMessage(conversationId, opts.text)
          }).catch(function(err) {
            console.log('@chat:message handler', err)
          })
        } else {
          // Är blockad eller har blockat
        }
      }).catch(function(err) {
        console.log('@chat:message relationship handler', err)
      })
    }
  })
}