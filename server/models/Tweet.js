'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  text: String,
  username: String,
  userImage: String,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('tweets', schema)