const { EventEmitter } = require('events')
const request = require('superagent')
const UserStore = new EventEmitter
const usersById = {}

var doc = window.__USER__

UserStore.insert = function(user) {
  usersById[user._id] = user
  usersById[user.username] = user
}

UserStore.getByUsername = function(username) {
  return new Promise(function(resolve, reject) {
    if (!username) {
      resolve(null)
    } else if (usersById[username]) {
      resolve(usersById[username])
    } else {
      request.get(`/api/user/${username}`).then(function({ body: user }) {
        user && UserStore.insert(user)
        resolve(user)
      }, reject)
    }
  })
}

UserStore.set = function(user) {
  doc = user
  UserStore.emit('doc', user)
}

UserStore.logIn = function(creds, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/login', creds, function(err, res) {
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
    request.post('/api/user/signup', form, function(err, res) {
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
  request.post('/api/user/logout').end()
  UserStore.emit('doc', null)
}

UserStore.subscribe = function(handler) {
  handler(doc)
  UserStore.on('doc', handler)
  return function unsubscribe() {
    UserStore.removeListener('doc', handler)
  }
}

UserStore.get = () => doc

module.exports = UserStore