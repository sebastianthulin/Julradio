'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.use(function(req, res, next) {
  if (req.session.uid) {
    next()
  } else {
    res.status(500).json({err: 'not signed in'})
  }
})

router.get('/', function(req, res) {
  db.Conversation
    .find({users: req.session.uid})
    .populate('users lastMessage')
    .exec()
    .then(function(conversations) {
      res.json(conversations)
    })
})

router.get('/:id', function(req, res) {
  db.Message.find({conversation: req.params.id}).exec().then(function(messages) {
    res.json(messages)
  }, function(err) {
    console.log(err)
  })
})

module.exports = router