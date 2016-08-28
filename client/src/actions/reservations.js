const {fromJS} = require('immutable')

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
