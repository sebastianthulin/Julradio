const {List} = require('immutable')

const request = (state, action) => {
  switch (action.type) {
    case 'DELETE_REQUEST':
    case 'DELETE_TWEET':
      return state.set('deleted', true)
    default:
      return state
  }
}

const requests = (state = List(), action) => {
  switch (action.type) {
    case 'RECEIVE_REQUESTS':
      return action.requests
    case 'RECEIVE_REQUEST':
      state = state.unshift(action.request)
      if (state.size === 51) state = state.splice(50, 1)
      return state
    case 'DELETE_REQUEST':
    case 'DELETE_TWEET':
      const index = state.findIndex(r => r.get('_id') === action.id)
      return index > -1 ? state.update(index, r => request(r, action)) : state
    default:
      return state
  }
}

module.exports = requests
