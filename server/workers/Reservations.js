'use strict';

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const db = require('../models')

var reservations = []
update()

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
    process.send(reservations)
    io.emit('reservations', reservations)
  })
}

function createReservation(opts) {
  new db.Reservation({
    user: opts.userId,
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).save().then(update).catch(console.error.bind(console))
}

function editReservation(id, opts) {
  db.Reservation.findByIdAndUpdate(id, {
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).exec().then(update).catch(console.error.bind(console))
}

function removeReservation(id) {
  db.Reservation.findByIdAndRemove(id).exec().then(update).catch(console.error.bind(console))
}

process.on('message', function(data) {
  switch (data.type) {
    case 'create':
      createReservation(data.opts); break
    case 'edit':
      editReservation(data.id, data.opts); break
    case 'remove':
      removeReservation(data.id); break
  }
})