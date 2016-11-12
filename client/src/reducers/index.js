const {combineReducers} = require('redux')

const onlineList = (state = [], action) => {
  if (action.type === 'RECEIVE_ONLINE_LIST') {
    return action.onlineList
  }
  return state
}

module.exports = combineReducers({
  player: require('./player'),
  articles: require('./articles'),
  modal: require('./modal'),
  visibility: require('./visibility'),
  requests: require('./requests'),
  reservations: require('./reservations'),
  onlineList
})
