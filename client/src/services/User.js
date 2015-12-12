const { EventEmitter } = require('events')
const request = require('superagent')
const API = require('../services/API')
const User = module.exports = new EventEmitter
const ChatStore = require('../stores/ChatStore')
const ShitStore = require('../stores/ShitStore')
const NotificationStore = require('../stores/NotificationStore')
const UserStore = require('../stores/UserStore')

var doc = null

function setAndCB(cb) {
  return function(user) {
    User.set(user)
    cb(user)
  }
}

User.set = function(user) {
  doc = user
  UserStore.insert(user)
  User.emit('doc', user)
}

User.block = (userId, cb) => API.post('/user/block', { userId }, cb)
User.unBlock = (userId, cb) => API.delete('/user/block/' + userId, cb)
User.update = (opts, cb) => API.put('/user/settings', opts, setAndCB(() => {
  NotificationStore.insert({type: 'settings'})
}))
User.update2 =  (opts, cb) => API.put('/user/settings2', opts, setAndCB(cb))
User.removeAvatar = cb => API.delete('/user/profilepicture', setAndCB(cb))

User.setAvatar = function(file, cb) {
  const formData = new FormData
  formData.append('avatar', file)
  request.post('/api/user/profilepicture').send(formData).end(function(err, { body: user }) {
    if (err) {
      return NotificationStore.error({value: err.response.body.error[0]})
    }
    User.set(user)
    cb(user)
  })
}

User.forgotPassword = function(form, cb) {
  request.post('/api/forgot', form, function(err, { body }) {
    cb(err, body)
    if (err) {
      NotificationStore.error({value: err.response.body.error[0]})
    }
  })
}

User.newPassword = function(id, password) {
  API.post('/forgot/' + id, { password }, function() {
    window.location = '/'
  })
}

User.logIn = function(creds) {
  API.post('/user/login', creds, function() {
    location.reload()
  })
}

User.signUp = (form, cb) => API.post('/user/signup', form, cb)

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
User.is = role => !!((User.get() || {}).roles || {})[role]
User.isWriter = () => User.is('writer')
User.isRadioHost = () => User.is('radioHost')
User.isAdmin = () => User.is('admin')
User.isAnything = () => User.isWriter() || User.isRadioHost() || User.isAdmin()

if (window.__USER__) {
  User.set(window.__USER__)
  ShitStore.fetch()
  ChatStore.fetch()
}