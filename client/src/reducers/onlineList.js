const {List, fromJS} = require('immutable')

const onlineList = (state = List(), action) => {
  switch (action.type) {
    case 'RECEIVE_ONLINE_LIST':
      return fromJS(action.onlineList)
    case 'RECEIVE_ONLINE_LIST_CHANGE': {
      if (action.connected) {
        return state.unshift(fromJS(action.user))
      }
      const i = state.findIndex(user => user.get('_id') === action.user._id)
      return state.splice(i, 1)
    }
    default:
      return state
  }
}

module.exports = onlineList
