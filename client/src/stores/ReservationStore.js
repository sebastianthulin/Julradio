const { EventEmitter } = require('events')
const API = require('../services/API')
const socket = require('../services/socket')
const ReservationStore = new EventEmitter

const state = {
  reservations: [],
  onair: null
}

function tick() {
  const now = Date.now() + window.__TIMEDIFFERENCE__
  let i = (state.reservations || []).length
  while (i--) {
    const r = state.reservations[i]
    if (now > r.startDate && now < r.endDate) {
      state.onair !== r && setOnAir(r)
      return
    }
  }
  state.onair && setOnAir(null) 
}

function setOnAir(reservation) {
  state.onair = reservation
  ReservationStore.emit('onair', reservation)
}

ReservationStore.create = (opts, cb) => API.post('/reservations', opts, cb)
ReservationStore.update = (id, opts, cb) => API.put('/reservations/' + id, opts, cb)
ReservationStore.delete = (id, cb) => API.delete('/reservations/' + id, cb)

ReservationStore.handleReservations = function(reservations) {
  reservations.forEach(res => {
    res.startDate = new Date(res.startDate)
    res.endDate = new Date(res.endDate)
  })
  state.reservations = reservations
  tick()
  ReservationStore.emit('reservations', reservations)
}

ReservationStore.subscribe = function(event, handler) {
  handler(state[event])
  ReservationStore.on(event, handler)
  return function unsubscribe() {
    ReservationStore.removeListener(event, handler)
  }
}

setInterval(tick, 1000)

socket.on('reservations', ReservationStore.handleReservations)

module.exports = ReservationStore