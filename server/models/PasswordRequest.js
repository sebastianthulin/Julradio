'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date,
    default: () => Date.now() + 1000 * 60 * 30
  }
})

module.exports = mongoose.model('passwordrequests', schema)
