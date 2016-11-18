'use strict'

const mongoose = require('mongoose')
const {Schema} = mongoose
const {apiError} = require('../utils/apiError')
const crypto = require('crypto')
const config = require('../../config')

const schema = new Schema({
  username: String,
  usernameLower: {
    type: String,
    lowercase: true,
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    index: true, 
    unique: true, 
    sparse: true
  },
  hash: String,
  name: String,
  birth: Date,
  description: String,
  gender: String,
  location: String,
  title: String,
  banned: Boolean,
  activated: {
    type: Boolean,
    default: false
  },
  picture: {
    type: Schema.ObjectId,
    ref: 'pictures'
  },
  roles: {
    writer: {
      type: Boolean,
      default: false
    },
    radioHost: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
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

schema.methods.signUp = async function(opts, callback) {
  await Promise.all([
    this.setUsername(opts.username),
    this.setEmail(opts.email)
  ])
  this.setPassword(opts.password)
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

schema.methods.setUsername = async function(username) {
  if (typeof username !== 'string') {
    throw apiError('STOP_HAXING_PLZ')
  }
  const usernameLower = username.toLowerCase()
  if (!/^\w+$/.test(username)) {
    throw apiError('USERNAME_INVALID_FORMAT')
  }
  if (mongoose.Types.ObjectId.isValid(this.username)) {
    throw apiError('USERNAME_INVALID_FORMAT')
  }
  if (username.length < 3) {
    throw apiError('USERNAME_TOO_SHORT')
  }
  if (username.length > 25) {
    throw apiError('USERNAME_TOO_LONG')
  }
  if (await User.findOne({usernameLower})) {
    throw apiError('USERNAME_TAKEN')
  }
  this.username = username
  this.usernameLower = usernameLower
}

schema.methods.setEmail = async function(email) {
  if (typeof email !== 'string') {
    throw apiError('EMAIL_INVALID')
  }
  email = email.toLowerCase()
  if (email.length > 254) {
    throw apiError('EMAIL_INVALID')
  }
  if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email)) {
    throw apiError('EMAIL_INVALID')
  }
  if (await User.findOne({email})) {
    throw apiError('EMAIL_TAKEN')
  }
  this.email = email
}

schema.methods.setPassword = function(password) {
  if (typeof password !== 'string') {
    throw apiError('STOP_HAXING_PLZ')
  }
  if (password.length === 0) {
    throw apiError('PASSWORD_EMPTY')
  }
  if (password.length < config.passwordMinLength) {
    throw apiError('PASSWORD_TOO_SHORT')
  }
  this.hash = sha256(password)
}

const User = module.exports = mongoose.model('users', schema)
