'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

function getUserConversationIds(userId) {
  return new Promise(function(resolve, reject) {
    db.User.where({id: userId}).fetch({
      withRelated: 'conversations'
    }).then(function(model) {
      const row = model.toJSON()
      const conversationIds = row.conversations.map(conv => conv.id)
      resolve(conversationIds)
    }).catch(reject)
  })
}

router.use(function(req, res, next) {
  if (req.session.uid) {
    next()
  } else {
    res.status(500).json({err: 'not signed in'})
  }
})

router.get('/', function(req, res) {
  db.User.where({id: req.session.uid}).fetch({
    withRelated: [
      'conversations',
      'conversations.users',
      'conversations.lastMessage',
      'conversations.lastMessage.user'
    ]
  }).then(function(model) {
    // console.log(model.toJSON().conversations)
    res.json(model.toJSON().conversations)
  })
})

router.get('/:id', function(req, res) {
  db.Chat.where({id: req.params.id}).fetch({
    withRelated: ['messages', 'messages.user']
  }).then(function(model) {
    res.json(model.toJSON().messages)
  }, function(err) {
    // körs ifall req.params.id är en string
    console.log(err)
  })
})

// Save message to db
router.post('/', function(req, res) {
  const userId = req.session.uid
  const text = req.body.text
  const conversationId = parseInt(req.body.conversationId)
  getUserConversationIds(userId).then(function(conversationIds) {
    if (conversationIds.indexOf(conversationId) === -1) {
      throw new Error()
    }
    return new db.Message({
      text: text.trim(),
      userId,
      conversationId
    }).save()
  }).then(function(model) {
    var message = model.toJSON()
    return new db.Chat({id: conversationId}).save({
      lastMessageId: message.id
    }, {
      patch: true
    })
  }).then(function() {
    res.sendStatus(200)
  }).catch(function(err) {
    res.status(500).json({err: 'MESSAGE_FAILED'})
  })
})

// Send message using userId.
// This will either create a new convo or find existing.
var req = {session: {uid: 1}}
var userId = 2
getUserConversationIds(req.session.uid).then(function(conversationIds) {
  return db.UserConversations.query(qb => qb
    .where({userId})
    .whereIn('conversationId', conversationIds)
  ).fetch()
}).then(function(model) {
  if (model) {
    var conversationId = model.toJSON().conversationId
    console.log('conversationId:', conversationId)
  } else {
    console.log('creating new convo...')
  }
}).catch(function(err) {
  console.log(err)
})

module.exports = router