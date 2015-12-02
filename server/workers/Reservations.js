'use strict';

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const share = require('../share')
const db = require('../models')

var reservations = []
setTimeout(update, 1000)

function update(items) {
  const d = new Date()
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  db.Reservation.find({
    startDate: {$gte: date}
  }).populate({
    path: 'user',
    select: '-hash -email'
  }).exec().then(function(docs) {
    reservations = docs.sort((a, b) => a.startDate - b.startDate)
    share.emit('Reservations', reservations)
    io.emit('reservations', reservations)
  })
}

share.on('Reservations:create', function(opts) {
  new db.Reservation({
    user: opts.userId,
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).save().then(update).catch(console.error.bind(console))
})

share.on('Reservations:edit', function(data) {
  const id = data.id
  const opts = data.opts
  db.Reservation.findByIdAndUpdate(id, {
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).exec().then(update).catch(console.error.bind(console))
})

share.on('Reservations:remove', function(id) {
  db.Reservation.findByIdAndRemove(id).exec().then(update).catch(console.error.bind(console))
})