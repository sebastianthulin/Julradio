'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  conversation: {
    type: Schema.ObjectId,
    ref: 'conversations'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('messages', schema)