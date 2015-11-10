'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  to: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  from: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  type: String,
  value: Schema.ObjectId,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('notifications', schema)