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

var sha256 = str => crypto.createHash('sha256').update(str).digest('hex')

schema.methods.signUp = function(opts, callback) {
  this.username = opts.username
  this.email = opts.email
  this.password = sha256(opts.password)
  this.save(callback)
  return this
}

schema.methods.auth = function(password) {
  return sha256(password) === this.password
}

module.exports = mongoose.model('users', schema)