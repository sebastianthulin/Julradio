'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../models')

router.use(middleware.signedIn)

router.get('/', (req, res) => {
  db.Conversation.find({
    users: req.userId
  }).populate({
    path: 'users lastMessage',
    select: '-hash -email'
  }).exec().then(conversations => {
    res.send(conversations)
  })
})

router.get('/:id/:offset', (req, res) => {
  const offset = req.params.offset
  const conversation = req.params.id
  db.Message.find({conversation}).sort('-_id').skip(offset).limit(50).exec().then(messages => {
    res.send(messages)
  }, err => {
    console.error(err)
  })
})

module.exports = router
