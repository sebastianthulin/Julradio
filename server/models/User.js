'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../../config')

const schema = new Schema({
  username: {
    type: String,
  },
  usernameLower: {
    type: String,
    lowercase: true,
    unique: true
  },
  email: String,
  hash: String,
  name: String,
  birth: Date,
  description: String,
  gender: String,
  location: String,
  title: String,
  banned: Boolean,
  picture: {
    type: Schema.ObjectId,
    ref: 'pictures'
  },
  admin: {
    type: Boolean,
    default: true
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const sha1 = str => typeof str === 'string'
  ? crypto.createHash('sha1').update(str).digest('hex')
  : null

const sha256 = str => typeof str === 'string'
  ? crypto.createHash('sha256').update(str).digest('hex')
  : null

schema.methods.signUp = function(opts, callback) {
  this.username = opts.username
  this.usernameLower = opts.username.toLowerCase()
  this.email = opts.email
  this.setPassword(opts.password)

  if (mongoose.Types.ObjectId.isValid(this.username)) {
    this.invalidate('username', 'INVALID_FORMAT')
  }

  return this.save()
}

schema.methods.auth = function(password) {
  if (sha256(password) === this.hash) {
    return true
  } else if (sha1(password) === this.hash) {
    this.hash = sha256(password)
    return true
  } else {
    return false
  }
}

schema.methods.setPassword = function(password) {
  if (typeof password !== 'string') {
    this.invalidate('password', 'INVALID_FORMAT')
  } else if (password.length === 0) {
    this.invalidate('password', 'PASSWORD_EMPTY')
  } else if (password.length < config.passwordMinLength) {
    this.invalidate('password', 'PASSWORD_TOO_SHORT')
  } else {
    this.hash = sha256(password)
    return true
  }
  return false
}

module.exports = mongoose.model('users', schema)