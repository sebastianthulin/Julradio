const {combineReducers} = require('redux')

module.exports = combineReducers({
  player: require('./player'),
  articles: require('./articles'),
  modal: require('./modal'),
  visibility: require('./visibility'),
  requests: require('./requests'),
  reservations: require('./reservations')
})
