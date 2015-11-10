'use strict';

const db = require('../models')
const io = require('../../server').io

function Notify(opts) {
  db.Notification.findOneAndUpdate({
    to: opts.userId,
    from: opts.from,
    type: opts.type,
    value: opts.value
  }, {
    to: opts.userId,
    from: opts.from,
    type: opts.type,
    value: opts.value,
    date: Date.now()
  }, {
    upsert: true,
    new: true
  }).populate('from').exec().then(function(doc) {
    io.to(opts.userId).emit('notification:new', doc)
  }).catch(function(err) {
    console.error('Notify error', err)
  })
}

module.exports = Notify