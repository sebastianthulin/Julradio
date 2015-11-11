'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date,
    default: function() {
      return Date.now() + 1000 * 60 * 24
    }
  }
})

module.exports = mongoose.model('passwordrequests', schema)