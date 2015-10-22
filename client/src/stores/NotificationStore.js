const { EventEmitter } = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const NotificationStore = new EventEmitter
const handlersByType = {}

const state = {
  message: [],
  wallPost: []
}

NotificationStore.on = function(type, handler) {
  handlersByType[type] = handler
}

NotificationStore.subscribe = function(type, handler) {
  handler(state[type].slice())
  NotificationStore.addListener(type, handler)
  return function unsubscribe() {
    NotificationStore.removeListener(type, handler)
  }
}

NotificationStore.clear = function(type, value) {
  const notifications = state[type]
  const i = notifications.indexOf(value)
  if (i > -1) {
    notifications.splice(i, 1)
    NotificationStore.emit(type, notifications.slice())
    NotificationStore.remove(type, value)
  }
}

NotificationStore.remove = function(type, value) {
  request.post('/api/notification', { type, value }).end()
}

socket.on('notification:new', function({ type, value }) {
  const notifications = state[type]
  const notSeen = handlersByType[type](value)
  if (notSeen) {
    if (notifications.indexOf(value) === -1) {
      notifications.push(value)
    }
    NotificationStore.emit(type, notifications.slice())
  } else {
    NotificationStore.remove(type, value)
  }
})

request.get('/api/notification').then(function({ body: notifications }) {
  var emitList = []
  for (var i = 0; i < notifications.length; i++) {
    var { type, value } = notifications[i]
    state[type].push(value)
    if (emitList.indexOf(type) === -1) {
      emitList.push(type)
    }
  }
  emitList.forEach(type => NotificationStore.emit(type, state[type].slice()))
}, function(err) {
  console.log('could not load messages')
})

module.exports = NotificationStore