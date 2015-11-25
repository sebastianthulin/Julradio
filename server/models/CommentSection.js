'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  count: {
    type: Number,
    default: 1
  },
  cosyCorner: Boolean,
  article: {
    type: Schema.ObjectId,
    ref: 'articles'
  },
  targetUser: {
    type: Schema.ObjectId,
    ref: 'users'
  }
})

const Comment = module.exports = mongoose.model('commentsections', schema)