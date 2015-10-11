const { EventEmitter } = require('events')
const request = require('superagent')
const UserStore = new EventEmitter
const usersById = {}
var doc

UserStore.insert = function(user) {
  usersById[user._id] = user
  usersById[user.username] = user
}

UserStore.getByUsername = function(username, callback) {
  if (!username) {
    callback(null)
  } else if (usersById[username]) {
    callback(usersById[username])
  } else {
    request.get(`/api/user/byname/${username}`).then(function({ body: user }) {
      user && UserStore.insert(user)
      callback(user)
    })
  }
}

UserStore.getAll = function(callback) {
  request.get('/api/user/all').then(function({ body: users }) {
    callback(users)
  })
}

UserStore.set = function(user) {
  doc = user
  UserStore.insert(user)
  UserStore.emit('doc', user)
}

UserStore.updateSettings = function(opts) {
  return new Promise(function(resolve, reject) {
    request.put('/api/user/settings', opts).then(function({ body: user }) {
      UserStore.set(user)
      resolve(user)
    }, ({ response }) => reject(response.body.err))
  })
}

UserStore.updatePassword = function(opts) {
  return new Promise(function(resolve, reject) {
    request.put('/api/user/password', opts)
      .then(resolve, ({ response }) => reject(response.body.err))
  })
}

UserStore.setAvatar = function(file) {
  const formData = new FormData
  formData.append('avatar', file)
  return new Promise(function(resolve, reject) {
    request.post('/api/user/profilepicture').send(formData).then(function({ body: user }) {
      console.log(user)
      UserStore.set(user)
      resolve(user)
    }, ({ response }) => reject(response.body.err))
  })
}

UserStore.updateUserSettings = function(userId, opts) {
  return new Promise(function(resolve, reject) {
    request.put(`/api/user/${userId}`, opts)
      .then(resolve, ({ response }) => reject(response.body.err))
  })
}

UserStore.logIn = function(creds, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/login', creds).then(function({ body: user }) {
      location.reload()
    }, function({ response }) {
      reject(response.body.err)
    })
  })
}

UserStore.signUp = function(form, callback) {
  return new Promise(function(resolve, reject) {
    request.post('/api/user/signup', form).then(function({ body: user }) {
      location.reload()
    }, function({ response }) {
      reject(response.body.err)
    })
  })
}

UserStore.logOut = function() {
  window.location = '/api/user/logout'
}

UserStore.subscribe = function(handler) {
  handler(doc)
  UserStore.on('doc', handler)
  return function unsubscribe() {
    UserStore.removeListener('doc', handler)
  }
}

UserStore.get = () => doc

window.__USER__ && UserStore.set(window.__USER__)

module.exports = UserStore