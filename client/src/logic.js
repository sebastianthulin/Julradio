const socket = require('./services/socket')
const requestActions = require('./actions/requests')
const reservationActions = require('./actions/reservations')

const logic = store => {

  // requests
  socket.on('requests', requests =>
    store.dispatch(requestActions.receiveRequests(requests))
  )

  socket.on('request', request =>
    store.dispatch(requestActions.recieveRequest(request))
  )

  // reservations
  socket.on('reservations', reservations => {
    store.dispatch(reservationActions.recieveReservations(reservations))
    reservationsTick()
  })

  const reservationsTick = () => {
    const now = Date.now() + window.__TIMEDIFFERENCE__
    const state = store.getState().reservations
    let i = state.get('items').size
    while (i--) {
      const r = state.getIn(['items', i])
      if (now > r.get('startDate') && now < r.get('endDate')) {
        state.get('onAir') !== r && store.dispatch(reservationActions.setOnAir(r))
        return
      }
    }
    state.get('onAir') && store.dispatch(reservationActions.setOnAir(null))
  }

  setInterval(reservationsTick, 1000)
}

module.exports = logic
