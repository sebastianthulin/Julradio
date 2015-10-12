const { EventEmitter } = require('events')
const request = require('superagent')
const UserStore = require('../stores/UserStore')
const User = new EventEmitter
var doc = null

User.set = function(user) {
  doc = user
  UserStore.insert(user)
  User.emit('doc', user)
}

User.wallPost = function(userId, text) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/wallpost', { userId, text }).then(resolve, reject)
  })
}

User.updateSettings = function(opts) {
  return new Promise(function(resolve, reject) {
    request.put('/api/user/settings', opts).then(function({ body: user }) {
      User.set(user)
      resolve(user)
    }, ({ response }) => reject(response.body.err))
  })
}

User.updatePassword = function(opts) {
  return new Promise(function(resolve, reject) {
    request.put('/api/user/password', opts)
      .then(resolve, ({ response }) => reject(response.body.err))
  })
}

User.setAvatar = function(file) {
  const formData = new FormData
  formData.append('avatar', file)
  return new Promise(function(resolve, reject) {
    request.post('/api/user/profilepicture').send(formData).then(function({ body: user }) {
      User.set(user)
      resolve(user)
    }, ({ response }) => reject(response.body.err))
  })
}

User.logIn = function(creds, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/login', creds).then(function({ body: user }) {
      location.reload()
    }, function({ response }) {
      reject(response.body.err)
    })
  })
}

User.signUp = function(form, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/signup', form).then(function({ body: user }) {
      location.reload()
    }, function({ response }) {
      reject(response.body.err)
    })
  })
}

User.logOut = function() {
  window.location = '/api/user/logout'
}

User.subscribe = function(handler) {
  handler(doc)
  User.on('doc', handler)
  return function unsubscribe() {
    User.removeListener('doc', handler)
  }
}

User.get = () => doc

window.__USER__ && User.set(window.__USER__)

module.exports = User