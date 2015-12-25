const { List } = require('immutable')

function request(state, action) {
  switch (action.type) {
    case 'DELETE_REQUEST':
    case 'DELETE_TWEET':
      return action.id === state.get('_id')
        ? state.set('deleted', true)
        : state
    default:
      return state
  }
}

function requests(state = List(), action) {
  switch (action.type) {
    case 'RECEIVE_REQUESTS':
      return action.requests
    case 'RECEIVE_REQUEST':
      state = state.unshift(action.request)
      if (state.size === 51) state = state.splice(50, 1)
      return state
    case 'DELETE_REQUEST':
    case 'DELETE_TWEET':
      return state.map(r => request(r, action))
    default:
      return state
  }
}

module.exports = requests