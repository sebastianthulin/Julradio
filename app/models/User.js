'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
  username: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('users', schema)