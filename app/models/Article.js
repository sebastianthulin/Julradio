'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  user: String,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('articles', schema)