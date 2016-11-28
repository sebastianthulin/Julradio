const {combineReducers} = require('redux')

module.exports = combineReducers({
  users: require('./users'),
  account: require('./account'),
  player: require('./player'),
  articles: require('./articles'),
  modal: require('./modal'),
  notifications: require('./notifications'),
  comments: require('./comments'),
  chat: require('./chat'),
  visibility: require('./visibility'),
  requests: require('./requests'),
  reservations: require('./reservations')
})
