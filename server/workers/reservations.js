'use strict'

const hub = require('clusterhub')
const sio = require('socket.io-emitter')
const {Reservation} = require('../models')

const io = sio({
  host: '127.0.0.1',
  port: 6379
})

const update = items => {
  const d = new Date()
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  Reservation.find({
    startDate: {$gte: date}
  }).populate({
    path: 'user',
    select: '-hash -email'
  }).lean().then(docs => {
    const reservations = docs.sort((a, b) => a.startDate - b.startDate)
    hub.set('reservations', reservations)
    io.emit('reservations', reservations)
  })
}

update()

hub.on('reservations:create', opts => {
  new Reservation({
    user: opts.userId,
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).save().then(update).catch(console.error)
})

hub.on('reservations:edit', data => {
  const id = data.id
  const opts = data.opts
  Reservation.findByIdAndUpdate(id, {
    description: opts.description,
    startDate: opts.startDate,
    endDate: opts.endDate
  }).exec().then(update).catch(console.error)
})

hub.on('reservations:remove', id => {
  Reservation.findByIdAndRemove(id).exec().then(update).catch(console.error)
})
