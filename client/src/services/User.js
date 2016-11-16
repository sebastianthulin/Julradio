const {EventEmitter} = require('events')
const request = require('superagent')
const API = require('../services/API')
const User = module.exports = new EventEmitter
const ChatStore = require('../stores/ChatStore')
const UserStore = require('../stores/UserStore')

let doc = null

const setAndCB = cb => {
  return user => {
    User.set(user)
    cb(user)
  }
}

User.set = user => {
  doc = user
  UserStore.insert(user)
  User.emit('doc', user)
}

User.block = (userId, cb) => API.post('/user/block', {userId}, cb)
User.unBlock = (userId, cb) => API.delete('/user/block/' + userId, cb)
User.update = (opts, cb) => API.put('/user/settings', opts, setAndCB(cb))
User.update2 =  (opts, cb) => API.put('/user/settings2', opts, setAndCB(cb))
User.removeAvatar = cb => API.delete('/user/profilepicture', setAndCB(cb))

User.setAvatar = (file, cb) => {
  const formData = new FormData
  formData.append('avatar', file)
  request.post('/api/user/profilepicture').send(formData).end((err, {body: user}) => {
    if (err) {
      console.error(err)
      return alert('Error, check console.')
      // return NotificationStore.error({value: err.response.body.error[0]})
    }
    User.set(user)
    cb(user)
  })
}

User.forgotPassword = (form, cb) => {
  request.post('/api/forgot', form, (err, {body}) => {
    cb(err, body)
    if (err) {
      console.error(err)
      alert('Error, check console.')
      // NotificationStore.error({value: err.response.body.error[0]})
    }
  })
}

User.newPassword = (id, password) => {
  API.post('/forgot/' + id, {password}, () => {
    window.location = '/'
  })
}

User.logIn = creds => {
  API.post('/user/login', creds, () => {
    location.reload()
  })
}

User.signUp = (form, cb) => API.post('/user/signup', form, cb)

User.logOut = () => {
  window.location = '/api/user/logout'
}

User.subscribe = handler => {
  handler(doc)
  User.on('doc', handler)
  return () => {
    User.removeListener('doc', handler)
  }
}

User.get = () => doc
User.is = role => !!((User.get() || {}).roles || {})[role]
User.isWriter = () => User.is('writer')
User.isRadioHost = () => User.is('radioHost')
User.isAdmin = () => User.is('admin')
User.isAnything = () => User.isWriter() || User.isRadioHost() || User.isAdmin()

if (window.__USER__) {
  User.set(window.__USER__)
  ChatStore.fetch()
}
