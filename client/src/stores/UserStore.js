const {EventEmitter} = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const API = require('../services/API')
const UserStore = new EventEmitter
const usersByName = {}
const wallPostsByUserId = {}

let crew
let onlineList = []

UserStore.insert = user => {
  if (user.birth) {
    user.birth = new Date(user.birth)
  }
  const s = Date.now() - Date.parse(user.birth)
  const age = s / (1000 * 60 * 60 * 24 * 365)
  user.age = isNaN(age) ? false : ~~age
  usersByName[user.username] = user
}

UserStore.get = (username, query, handler, errHandler) => {
  request.get('/api/user/profile', {
    query,
    username,
    userId: (usersByName[username] || {})._id
  }, (err, {body}) => {
    if (err) {
      return errHandler(err)
    }
    if (body.profile) {
      UserStore.insert(body.profile)
    }
    handler(body)
  })
}

UserStore.getByUsername = (username, callback) => {
  if (!username) {
    callback(null)
  } else if (usersByName[username]) {
    callback(usersByName[username])
  } else {
    API.get(`/user/byname/${username}`, user => {
      user && UserStore.insert(user)
      callback(user)
    })
  }
}

UserStore.getCrew = callback => {
  if (crew) callback(crew)
  API.get('/crew', body => {
    crew = body
    crew.forEach(UserStore.insert)
    callback(crew)
  })
}

UserStore.getAll = callback => {
  API.get('/user/all', users => {
    users.forEach(user => user.usernameLower = user.username.toLowerCase())
    users.sort((a, b) => {
      if (a.usernameLower < b.usernameLower) return -1
      if (a.usernameLower > b.usernameLower) return 1
      return 0
    })
    callback(users)
  })
}

UserStore.updateUserSettings = (userId, opts, cb) => {
  API.put(`/user/${userId}`, opts, cb)
}

UserStore.removeUserAvatar = (userId, cb) => {
  API.delete(`/user/${userId}/avatar`, cb)
}

UserStore.updateCrew = (userIds, cb) => {
  API.put('/crew', userIds, cb)
}

socket.on('onlinelist', list => {
  onlineList = list
})

module.exports = UserStore
