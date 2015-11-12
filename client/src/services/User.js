const { EventEmitter } = require('events')
const { Promise } = require('es6-promise')
const request = require('../services/request')
const NotificationStore = require('../stores/NotificationStore')
const UserStore = require('../stores/UserStore')
const User = new EventEmitter

var doc = null

function errorHandler(type, value) {
  NotificationStore.error({ type, value })
}

User.set = function(user) {
  doc = user
  UserStore.insert(user)
  User.emit('doc', user)
}

User.block = userId => request.post('/api/user/block', { userId })
User.unBlock = userId => request.del('/api/user/block/' + userId)
User.wallPost = (userId, text) => request.post('/api/user/wallpost', { userId, text })
User.deleteWallPost = postId => request.del('/api/user/wallpost/' + postId)

User.update = opts => new Promise(function(resolve, reject) {
  request.put('/api/user/settings', opts).then(function({ body: user }) {
    User.set(user)
    resolve(user)
  }).catch(function({ response }) {
    reject(response.body.error)
  })
})

User.update2 = opts => new Promise(function(resolve, reject) {
  request.put('/api/user/settings2', opts).then(function({ body: user }) {
    User.set(user)
    resolve(user)
  }).catch(function({ response }) {
    reject(response.body.error)
  })
})

User.setAvatar = function(file) {
  const formData = new FormData
  formData.append('avatar', file)
  return new Promise(function(resolve, reject) {
    request.post('/api/user/profilepicture').send(formData).then(function({ body: user }) {
      User.set(user)
      resolve(user)
    }).catch(function({ response }) {
      errorHandler('avatar', response.body.error[0])
      reject(response.body.error)
    })
  })
}

User.comment = function(articleId, comment, callback) {
  request.post('/api/article/' + articleId + '/comment/', { comment }).then(callback)
}

User.forgotPassword = function(form) {
  return new Promise(function(resolve, reject) {
    request.post('/api/forgot', form).then(function() {
      resolve()
    }, function({ response }) {
      errorHandler('forgotpassword', response.body.error[0])
      reject(response.body.error[0])
    })
  })
}

User.newPassword = function(id, password, errHandler) {
  request.post('/api/forgot/' + id, { password }).then(function() {
    location.reload()
  }, function({ response }) {
    errorHandler('newpassword', response.body.error[0])
    errHandler(response.body.error[0])
  })
}

User.logIn = function(creds, errHandler) {
  request.post('/api/user/login', creds).then(function() {
    location.reload()
  }).catch(function({ response }) {
    errorHandler('login', response.body.error[0])
    errHandler && errHandler(response.body.error[0])
  })
}

User.signUp = function(form, errHandler) {
  request.post('/api/user/signup', form).then(function() {
    location.reload()
  }, function({ response }) {
    errorHandler('signup', response.body.error[0])
    errHandler && errHandler(response.body.error[0])
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
User.is = role => !!((User.get() || {}).roles || {})[role]
User.isWriter = () => User.is('writer')
User.isRadioHost = () => User.is('radioHost')
User.isAdmin = () => User.is('admin')
User.isAnything = () => User.isWriter() || User.isRadioHost() || User.isAdmin()

window.__USER__ && User.set(window.__USER__)

module.exports = User