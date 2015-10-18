const { EventEmitter } = require('events')
const socket = require('../services/socket')
const NotificationStore = new EventEmitter

const state = {
  conversations: [],
  wallPosts: []
}

NotificationStore.clear = function(type, id) {
  const i = state[type].indexOf(id)
  if (i > -1) {
    state[type].splice(i, 1)
    socket.emit('notification:clear', { type, id })
    NotificationStore.emit(type, state[type].slice())
  }
}

NotificationStore.subscribe = function(type, handler) {
  handler(state[type].slice())
  NotificationStore.on(type, handler)
  return function unsubscribe() {
    NotificationStore.removeListener(type, handler)
  }
}

socket.on('notification:new', function({ type, value }) {
  const notifications = state[type + 's']
  notifications.push(value)
  NotificationStore.emit(type, notifications.slice())
})

module.exports = NotificationStore