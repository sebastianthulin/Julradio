const store = require('./store')
const socket = require('./services/socket')
const { receiveRequests, recieveRequest } = require('./actions/requests')
const { setOnAir, recieveReservations } = require('./actions/reservations')

// requests
socket.on('requests', requests =>
  store.dispatch(receiveRequests(requests)))

socket.on('request', request =>
  store.dispatch(recieveRequest(request)))

// reservations
socket.on('reservations', reservations => {
  store.dispatch(recieveReservations(reservations))
  reservationsTick()
})

function reservationsTick() {
  const now = Date.now() + window.__TIMEDIFFERENCE__
  const state = store.getState().reservations
  let i = state.get('items').size
  while (i--) {
    const r = state.getIn(['items', i])
    if (now > r.get('startDate') && now < r.get('endDate')) {
      state.get('onAir') !== r && store.dispatch(setOnAir(r))
      return
    }
  }
  state.get('onAir') && store.dispatch(setOnAir(null))
}

setInterval(reservationsTick, 1000)