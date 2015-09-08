var { EventEmitter } = require('events')
var request = require('superagent')
var UserStore = new EventEmitter
var doc

UserStore.set = function(user) {
  doc = user
  UserStore.emit('doc', user)
}

UserStore.logIn = function(creds, callback) {
  request.post('/login', creds, function(err, res) {
    callback(res.body.err, res.body.user)
    if (res.body.user) {
      UserStore.set(res.body.user)
    }
  })
}

UserStore.signUp = function(form, callback) {
  request.post('/signup', form, function(err, res) {
    callback(res.body.err, res.body.user)
    if (res.body.user) {
      UserStore.set(res.body.user)
    }
  })
}

UserStore.logOut = function() {
  doc = null
  request.post('/logout').end()
  UserStore.emit('doc', null)
}

UserStore.subscribe = function(handler) {
  handler(doc)
  UserStore.on('doc', handler)
  return function unsubscribe() {
    UserStore.removeListener('doc', handler)
  }
}

module.exports = UserStore