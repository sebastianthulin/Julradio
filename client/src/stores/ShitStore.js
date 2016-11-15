const {EventEmitter} = require('events')
const socket = require('../services/socket')
const request = require('superagent')
const NotificationStore = require('./NotificationStore')
const ShitStore = new EventEmitter
const handlersByType = {}

const state = {
  message: [],
  wallPost: []
}

const handleNotification = (opts, notify) => {
  const {_id, type, value} = opts
  const notifications = state[type]
  const seen = handlersByType[type] && handlersByType[type](value)
  if (seen) {
    ShitStore.remove(type, value)
  } else {
    notify && NotificationStore.insert(opts)
    if (notifications.indexOf(value) === -1) {
      notifications.push(value)
    }
    ShitStore.emit(type, notifications.slice())
  }
}

ShitStore.on = (type, handler) => {
  handlersByType[type] = handler
}

ShitStore.subscribe = (type, handler) => {
  handler(state[type].slice())
  ShitStore.addListener(type, handler)
  return () => {
    ShitStore.removeListener(type, handler)
  }
}

ShitStore.clear = (type, value = null) => {
  const notifications = state[type]
  const i = notifications.indexOf(value)
  if (i > -1) {
    notifications.splice(i, 1)
    ShitStore.emit(type, notifications.slice())
    ShitStore.remove(type, value)
  }
}

ShitStore.remove = (type, value) => {
  request.post('/api/notification', {type, value}).end()
}

socket.on('notification:new', opts => {
  handleNotification(opts, true)
})

ShitStore.fetch = () => {
  request.get('/api/notification', (err, {body: notifications}) => {
    notifications && notifications.forEach(handleNotification)
  })
}

module.exports = ShitStore
