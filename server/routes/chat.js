'use strict';

const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../models')

router.use(middleware.signedIn)

router.get('/', function(req, res) {
  db.Conversation.find({
    users: req.userId
  }).populate({
    path: 'users lastMessage',
    select: '-hash -email'
  }).exec().then(function(conversations) {
    res.send(conversations)
  })
})

router.get('/:id/:offset', function(req, res) {
  const offset = req.params.offset
  const conversation = req.params.id
  db.Message.find({ conversation }).sort('-_id').skip(offset).limit(50).exec().then(function(messages) {
    res.send(messages)
  }, function(err) {
    console.error(err)
  })
})

module.exports = router