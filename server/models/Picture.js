'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  extension: String,
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('pictures', schema)
