const { EventEmitter } = require('events')
const request = require('../services/request')
const UserStore = new EventEmitter
const usersByName = {}
const wallPostsByUserId = {}
var crew

UserStore.insert = function(user) {
  usersByName[user.username] = user
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

UserStore.getWallPosts = function(userId, callback) {
  if (!userId) {
    return callback(null)
  }
  if (wallPostsByUserId[userId]) {
    callback(wallPostsByUserId[userId])
  }
  request.get(`/api/user/wallposts/${userId}`).then(function({ body: posts }) {
    posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    posts.forEach(({ from: user }) => UserStore.insert(user))
    wallPostsByUserId[userId] = posts
    callback(posts)
  })
}

UserStore.getAll = function(callback) {
  request.get('/api/user/all').then(function({ body: users }) {
    callback(users)
  })
}

UserStore.updateUserSettings = function(userId, opts) {
  return request.put(`/api/user/${userId}`, opts)
}

UserStore.updateCrew = function(userIds) {
  return request.put('/api/crew', userIds)
}

module.exports = UserStore