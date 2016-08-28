'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  description: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date
})

module.exports = mongoose.model('reservations', schema)
