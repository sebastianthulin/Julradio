'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: str => str.length <= 500,
      message: 'TEXT_TOO_LONG'
    }
  },
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  replyTo: {
    type: Schema.ObjectId,
    ref: 'comments'
  },

  // If set, this user can have the comment removed
  owner: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },


  // A comment should have one of the following:
  wall: Boolean,
  article: {
    type: Schema.ObjectId,
    ref: 'articles'
  },
  targetUser: {
    type: Schema.ObjectId,
    ref: 'users'
  }
})

module.exports = mongoose.model('comments', schema)