const {List, fromJS} = require('immutable')

const onlineList = (state = List(), action) => {
  if (action.type === 'RECEIVE_ONLINE_LIST') {
    return fromJS(action.onlineList)
  }
  return state
}

module.exports = onlineList
