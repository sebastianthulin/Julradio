const socket = require('./services/socket')
const {receiveRequests, recieveRequest} = require('./actions/requests')
const {recieveReservations, setOnAir} = require('./actions/reservations')
const {setHistory, setNowPlaying, togglePlay, setVolume} = require('./actions/player')
const localStorage = window.localStorage || {}

const logic = store => {

  // requests
  socket.on('requests', requests => {
    store.dispatch(receiveRequests(requests))
  })

  socket.on('request', request => {
    store.dispatch(recieveRequest(request))
  })

  // reservations
  socket.on('reservations', reservations => {
    store.dispatch(recieveReservations(reservations))
    reservationsTick()
  })

  socket.on('metadata', ({playing, history}) => {
    history && store.dispatch(setHistory(history))
    playing && store.dispatch(setNowPlaying(playing))
  })

  store.dispatch(setVolume(localStorage.volume === undefined ? 1 : Number(localStorage.volume)))
  localStorage.playing == 1 && store.dispatch(togglePlay())

  const reservationsTick = () => {
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
}

module.exports = logic
