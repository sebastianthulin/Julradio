'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  from: {
    type: Schema.ObjectId,
    ref: 'users',
    required: true
  },
  target: {
    type: Schema.ObjectId,
    ref: 'users',
    required: true
  },
})


module.exports = mongoose.model('blocks', schema)
