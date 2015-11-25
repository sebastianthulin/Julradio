'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: str => str.length <= 1000,
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
  numReplies: {
    type: Number,
    default: 0
  },
  commentSection: {
    type: Schema.ObjectId,
    ref: 'comment sections'
  }
})

schema.statics.updateReplyCount = function(commentId) {
  return Comment.count({replyTo: commentId}).exec().then(function(numReplies) {
    return Comment.findByIdAndUpdate(commentId, { numReplies }).exec()
  })
}

const Comment = module.exports = mongoose.model('comments', schema)