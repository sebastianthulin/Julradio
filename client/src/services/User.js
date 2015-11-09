const { EventEmitter } = require('events')
const Promise = require('es6-promise').Promise
const request = require('../services/request')
const UserStore = require('../stores/UserStore')
const User = new EventEmitter

var doc = null

User.set = function(user) {
  doc = user
  UserStore.insert(user)
  User.emit('doc', user)
}

User.block = userId => request.post('/api/user/block', { userId })
User.unBlock = userId => request.del('/api/user/block/' + userId)
User.wallPost = (userId, text) => request.post('/api/user/wallpost', { userId, text })
User.deleteWallPost = postId => request.del('/api/user/wallpost/' + postId)

User.updateField = opts => new Promise(function(resolve, reject) {
  request.put('/api/user/field', opts).then(function({ body: user }) {
    User.set(user)
    resolve(user)
  }).catch(reject)
})

User.updateSettings = opts => new Promise(function(resolve, reject) {
  request.put('/api/user/settings', opts).then(function({ body: user }) {
    User.set(user)
    resolve(user)
  }).catch(function({ response }) {
    reject(response.body.err)
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
      reject(response.body.err)
    })
  })
}

User.comment = function(articleId, comment, callback) {
  request.post('/api/article/' + articleId + '/comment/', {comment}).then(callback)
}

User.logIn = function(creds, errHandler) {
  request.post('/api/user/login', creds).then(function() {
    location.reload()
  }).catch(function({ response }) {
    errHandler(response.body.err)
  })
}

User.signUp = function(form, errHandler) {
  request.post('/api/user/signup', form).then(function() {
    location.reload()
  }, function({ response }) {
    errHandler(response.body.err)
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