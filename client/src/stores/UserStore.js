const { EventEmitter } = require('events')
const request = require('superagent')
const UserStore = new EventEmitter
var doc

UserStore.set = function(user) {
  doc = user
  UserStore.emit('doc', user)
}

UserStore.logIn = function(creds, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/user/login', creds, function(err, res) {
      var { err, user } = res.body
      user && UserStore.set(user)
      if (err) {
        reject(err)
      } else {
        resolve(user)
      }
    })
  })
}

UserStore.signUp = function(form, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/user/signup', form, function(err, res) {
      var { err, user } = res.body
      user && UserStore.set(user)
      if (err) {
        reject(err)
      } else {
        resolve(user)
      }
    })
  })
}

UserStore.logOut = function() {
  doc = null
  request.post('/user/logout').end()
  UserStore.emit('doc', null)
}

UserStore.subscribe = function(handler) {
  handler(doc)
  UserStore.on('doc', handler)
  return function unsubscribe() {
    UserStore.removeListener('doc', handler)
  }
}

user && UserStore.set(user)

module.exports = UserStore