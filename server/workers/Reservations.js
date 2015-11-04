'use strict';

const db = require('../models')
const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})

function update(items) {
  reservations = items
    .filter(res => res.endDate.getTime() > Date.now() - 1000000000)
    .sort((a, b) => a.startDate - b.startDate)

  process.send(reservations)
  io.emit('reservations', reservations)
}

var reservations = []

db.Reservation.find().sort('-_id').limit(30).exec().then(update)

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

function createReservation(opts) {
  new db.Reservation({
    user: opts.userId,
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).save().then(function(doc) {
    reservations.push(doc)
    update(reservations)
  }).catch(console.error)
}

function editReservation(id, opts) {

}

function removeReservation(id) {
  db.Reservation.findByIdAndRemove(id).exec().then(function() {
    let i = reservations.length
    while (i--) {
      if (reservations[i]._id == id) {
        reservations.splice(i, 1)
      }
    }
    update(reservations)
  }).catch(console.error)
}