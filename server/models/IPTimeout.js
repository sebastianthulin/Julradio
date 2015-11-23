'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  ip: String,
  action: String,
  expires: Date
})

module.exports = mongoose.model('ip timeouts', schema)