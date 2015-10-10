'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')

const schema = new Schema({
  username: String,
  email: String,
  hash: String,
  realname: String,
  description: String,
  admin: {
    type: Boolean,
    default: false
  },
  crew: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const sha256 = str => crypto.createHash('sha256').update(str).digest('hex')

schema.methods.signUp = function(opts, callback) {
  this.username = opts.username
  this.email = opts.email
  this.hash = sha256(opts.password)

  if (mongoose.Types.ObjectId.isValid(this.username)) {
    this.invalidate('username', 'invalid format')
  }

  return this.save()
}

schema.methods.auth = function(password) {
  return sha256(password) === this.hash
}

module.exports = mongoose.model('users', schema)