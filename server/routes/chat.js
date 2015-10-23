'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.use(function(req, res, next) {
  if (req.session.uid) {
    next()
  } else {
    res.status(500).send({err: 'not signed in'})
  }
})

router.get('/', function(req, res) {
  db.Conversation.find({
    users: req.session.uid
  }).populate({
    path: 'users lastMessage',
    select: '-hash'
  }).exec().then(function(conversations) {
    db.Conversation.populate(conversations, {
      path: 'users.picture',
      model: 'pictures'
    }, function(err, conversations) {
      res.send(conversations)
    })
  })
})

router.get('/:id/:offset', function(req, res) {
  const offset = req.params.offset
  const conversation = req.params.id
  db.Message.find({ conversation }).sort('-_id').skip(offset).limit(50).exec().then(function(messages) {
    res.send(messages)
  }, function(err) {
    console.log(err)
  })
})

module.exports = router