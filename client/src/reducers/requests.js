const {List} = require('immutable')

const feedItem = (state, action) => {
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
    case 'RECEIVE_FEED':
      return action.feed
    case 'RECEIVE_FEED_ITEM':
      state = state.unshift(action.feedItem)
      if (state.size === 51) state = state.splice(50, 1)
      return state
    case 'DELETE_REQUEST':
    case 'DELETE_TWEET':
      const index = state.findIndex(item => item.get('_id') === action.id)
      return index > -1 ? state.update(index, item => feedItem(item, action)) : state
    default:
      return state
  }
}

module.exports = requests
