'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  song: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  granted: Boolean,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('requests', schema)