const { EventEmitter } = require('events')
const socket = require('../services/socket')
const request = require('../services/request')
const NotificationStore = require('./NotificationStore')
const ShitStore = new EventEmitter
const handlersByType = {}

const state = {
  message: [],
  wallPost: []
}

function handleNotification(opts, notify) {
  const { _id, type, value } = opts
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

ShitStore.on = function(type, handler) {
  handlersByType[type] = handler
}

ShitStore.subscribe = function(type, handler) {
  handler(state[type].slice())
  ShitStore.addListener(type, handler)
  return function unsubscribe() {
    ShitStore.removeListener(type, handler)
  }
}

ShitStore.clear = function(type, value = null) {
  const notifications = state[type]
  const i = notifications.indexOf(value)
  if (i > -1) {
    notifications.splice(i, 1)
    ShitStore.emit(type, notifications.slice())
    ShitStore.remove(type, value)
  }
}

ShitStore.remove = function(type, value) {
  request.post('/api/notification', { type, value }).end()
}

socket.on('notification:new', function(opts) {
  handleNotification(opts, true)
})

ShitStore.fetch = function() {
  request.get('/api/notification').then(function({ body: notifications }) {
    notifications.forEach(handleNotification)
  }).catch(console.error.bind(console))
}

module.exports = ShitStore