const { List, Map } = require('immutable')

const initialState = Map({
  items: List(),
  onAir: null
})

function reservations(state = initialState, action) {
  switch (action.type) {
    case 'RECEIVE_RESERVATIONS':
      return state.set('items', action.reservations)
    case 'SET_ON_AIR':
      return state.set('onAir', action.onAir)
    default:
      return state
  }
}

module.exports = reservations