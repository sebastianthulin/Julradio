const { EventEmitter } = require('events')
const { Promise } = require('es6-promise')
const request = require('../services/request')
const NotificationStore = require('../stores/NotificationStore')
const UserStore = require('../stores/UserStore')
const User = new EventEmitter

var doc = null

function handleError(type, reject) {
  return function({ response }) {
    const error = response.body.error
    reject && reject(error)
    NotificationStore.error({
      type,
      value: error
    })
  }
}

function justok(resolve) {
  return function({ body }) {
    resolve(body)
  }
}

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
User.wallPost = (userId, text) => User.comment('/api/comment/wallpost', { userId, text })
User.reply = (replyTo, text) => User.comment('/api/comment/reply', { replyTo, text })
User.articleComment = (articleId, text) => User.comment('/api/comment/articlecomment', { articleId, text })
User.deleteComment = commentId => request.del('/api/comment/' + commentId)

User.comment = (url, opts) =>
  new Promise((a, b) =>
    request.post(url, opts).then(justok(a)).catch(handleError('comment', b)))

User.update = opts => new Promise(function(resolve, reject) {
  request.put('/api/user/settings', opts).then(function({ body: user }) {
    User.set(user)
    resolve(user)
  }).catch(handleError('settings', reject))
})

User.update2 = opts => new Promise(function(resolve, reject) {
  request.put('/api/user/settings2', opts).then(function({ body: user }) {
    User.set(user)
    resolve(user)
  }).catch(handleError('settings', reject))
})

User.setAvatar = function(file) {
  const formData = new FormData
  formData.append('avatar', file)
  return new Promise(function(resolve, reject) {
    request.post('/api/user/profilepicture').send(formData).then(function({ body: user }) {
      User.set(user)
      resolve(user)
    }).catch(handleError('avatar', reject))
  })
}

User.forgotPassword = form =>
  new Promise((a, b) =>
    request.post('/api/forgot', form).then(justok(a)).catch(handleError('forgotpassword', b)))

User.newPassword = function(id, password) {
  return new Promse(function(resolve, reject) {
    request.post('/api/forgot/' + id, { password }).then(function() {
      location.reload()
    }).catch(handleError('newpassword', reject))
  })
}

User.logIn = function(creds) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/login', creds).then(function() {
      location.reload()
    }).catch(handleError('login', reject))
  })
}

User.signUp = function(form) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/signup', form).then(function() {
      location.reload()
    }).catch(handleError('signup', reject))
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