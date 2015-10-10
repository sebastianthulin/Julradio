'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  users: [{
    type: Schema.ObjectId,
    ref: 'users'
  }],
  lastMessage: {
    type: Schema.ObjectId,
    ref: 'messages'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('conversations', schema)