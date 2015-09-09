'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var crypto = require('crypto')

var schema = new Schema({
  username: String,
  email: String,
  password: String,
  date: {
    type: Date,
    default: Date.now
  }
})

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

var user = schema.methods = {}

user.signUp = function(opts) {
  this.password = sha256(opts.password)
}

user.auth = function(password) {
  return sha256(password) === this.password
}

module.exports = mongoose.model('users', schema)