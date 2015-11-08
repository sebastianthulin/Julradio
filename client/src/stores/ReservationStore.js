const { EventEmitter } = require('events')
const request = require('../services/request')
const socket = require('../services/socket')
const ReservationStore = new EventEmitter

const state = {
  reservations: null,
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

ReservationStore.create = opts => request.post('/api/reservations', opts).end()
ReservationStore.update = (id, opts) => request.put('/api/reservations/' + id, opts).end()
ReservationStore.delete = id => request.del('/api/reservations/' + id).end()

ReservationStore.handleReservations = function(reservations) {
  const today = new Date(Date.now() + window.__TIMEDIFFERENCE__).getDate()
  reservations.forEach(res => {
    res.startDate = new Date(res.startDate)
    res.endDate = new Date(res.endDate)
    res.today = res.startDate.getDate() === today
    res.tomorrow = res.startDate.getDate() === today + 1
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