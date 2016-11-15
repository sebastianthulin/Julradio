const {combineReducers} = require('redux')

module.exports = combineReducers({
  player: require('./player'),
  articles: require('./articles'),
  modal: require('./modal'),
  comments: require('./comments'),
  visibility: require('./visibility'),
  requests: require('./requests'),
  reservations: require('./reservations'),
  search: require('./search'),
  onlineList: require('./onlineList')
})
