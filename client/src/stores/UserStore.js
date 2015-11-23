const { EventEmitter } = require('events')
const { Promise } = require('es6-promise')
const request = require('../services/request')
const UserStore = new EventEmitter
const usersByName = {}
const wallPostsByUserId = {}
var crew

UserStore.insert = function(user) {
  if (user.birth) {
    user.birth = new Date(user.birth)
  }
  const s = Date.now() - Date.parse(user.birth)
  const age = s / (1000 * 60 * 60 * 24 * 365)
  user.age = isNaN(age) ? false : ~~age
  usersByName[user.username] = user
}

UserStore.get = function(username, query) {
  return new Promise(function(resolve, reject) {
    request.get('/api/user/profile', {
      query,
      username,
      userId: (usersByName[username] || {})._id
    }).then(function({ body }) {
      if (body.profile) {
        UserStore.insert(body.profile)
      }
      resolve(body)
    }).catch(reject)
  })
}

UserStore.getByUsername = function(username, callback) {
  if (!username) {
    callback(null)
  } else if (usersByName[username]) {
    callback(usersByName[username])
  } else {
    request.get(`/api/user/byname/${username}`).then(function({ body: user }) {
      user && UserStore.insert(user)
      callback(user)
    })
  }
}

UserStore.getCrew = function(callback) {
  if (crew) callback(crew)
  request.get('/api/crew').then(({ body }) => {
    crew = body
    crew.forEach(UserStore.insert)
    callback(crew)
  })
}

UserStore.getAll = function(callback) {
  request.get('/api/user/all').then(function({ body: users }) {
    users.forEach(user => user.usernameLower = user.username.toLowerCase())
    users.sort(function(a, b) {
      if (a.usernameLower < b.usernameLower) return -1
      if (a.usernameLower > b.usernameLower) return 1
      return 0
    })
    callback(users)
  })
}

UserStore.updateUserSettings = function(userId, opts) {
  return request.put(`/api/user/${userId}`, opts)
}

UserStore.removeUserAvatar = function(userId) {
  return request.del(`/api/user/${userId}/avatar`)
}

UserStore.updateCrew = function(userIds) {
  return request.put('/api/crew', userIds)
}

module.exports = UserStore