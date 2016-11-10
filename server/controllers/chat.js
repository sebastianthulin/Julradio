'use strict'

const {Conversation, Message} = require('../models')

exports.list = (req, res) => {
  Conversation.find({
    users: req.userId
  }).populate({
    path: 'users lastMessage',
    select: '-hash -email'
  }).exec().then(conversations => {
    res.send(conversations)
  })
}

exports.fetch = (req, res) => {
  const offset = parseInt(req.params.offset)
  const conversation = req.params.id
  Message.find({conversation}).sort('-_id').skip(offset).limit(50).exec().then(messages => {
    res.send(messages)
  }, err => {
    console.error(err)
  })
}
