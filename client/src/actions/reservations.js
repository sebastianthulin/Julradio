const request = require('superagent')
const {fromJS} = require('immutable')
const {errorNotify} = require('./notifications')

const transform = res => {
  res.startDate = new Date(res.startDate)
  res.endDate = new Date(res.endDate)
  return res
}

export const recieveReservations = reservations => ({
  type: 'RECEIVE_RESERVATIONS',
  reservations: fromJS(reservations.map(transform))
})

export const setOnAir = onAir => ({
  type: 'SET_ON_AIR',
  onAir
})

// not touching state
export const createReservation = opts => dispatch => {
  return request.post('/api/reservations', opts).then(res => res.body).catch(err => dispatch(errorNotify(err)))
}

export const updateReservation = (id, opts) => dispatch => {
  return request.put('/api/reservations/' + id, opts).then(res => res.body).catch(err => dispatch(errorNotify(err)))
}

export const deleteReservation = id => dispatch => {
  return request.delete('/api/reservations/' + id).then(res => res.body).catch(err => dispatch(errorNotify(err)))
}
