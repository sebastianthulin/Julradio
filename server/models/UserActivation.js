'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  }
})

module.exports = mongoose.model('user activations', schema)