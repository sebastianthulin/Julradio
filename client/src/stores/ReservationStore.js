const { EventEmitter } = require('events')
const request = require('../services/request')
const socket = require('../services/socket')
const ReservationStore = new EventEmitter

var reservations

ReservationStore.create = function(opts) {
  return request.post('/api/reservations', opts).end()
}

ReservationStore.update = function(id, opts) {
  return request.put('/api/reservations/' + id, opts).end()
}

ReservationStore.delete = function(id) {
  return request.del('/api/reservations/' + id).end()
}

ReservationStore.handleReservations = function(data) {
  const today = new Date(Date.now() + window.__TIMEDIFFERENCE__).getDate()
  reservations = data
  reservations.forEach(res => {
    res.startDate = new Date(res.startDate)
    res.endDate = new Date(res.endDate)
    res.today = res.startDate.getDate() === today
    res.tomorrow = res.startDate.getDate() === today + 1
  })
  ReservationStore.emit('data', reservations)
}

ReservationStore.subscribe = function(handler) {
  handler(reservations)
  ReservationStore.on('data', handler)
  return function unsubscribe() {
    ReservationStore.removeListener('data', handler)
  }
}

socket.on('reservations', ReservationStore.handleReservations)

module.exports = ReservationStore