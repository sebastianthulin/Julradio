const {combineReducers} = require('redux')

module.exports = combineReducers({
  articles: require('./articles'),
  modal: require('./modal'),
  visibility: require('./visibility'),
  requests: require('./requests'),
  reservations: require('./reservations')
})
