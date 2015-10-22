'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  from: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  target: {
    type: Schema.ObjectId,
    ref: 'users'
  },
})


module.exports = mongoose.model('blocks', schema)