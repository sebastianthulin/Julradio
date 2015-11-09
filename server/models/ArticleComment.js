'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  article: {
    type: Schema.ObjectId,
    ref: 'articles'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('articlecomments', schema)