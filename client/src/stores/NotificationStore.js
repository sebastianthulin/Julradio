const { EventEmitter } = require('events')
const NotificationStore = new EventEmitter

const state = []

NotificationStore.insert = function({ type, value }) {
  const notification = {
    key: Math.random(),
    type,
    value,
    visible: true
  }
  state.push(notification)
  NotificationStore.emit('change', state.slice())
  setTimeout(function() {
    state.splice(state.indexOf(notification), 1)
    NotificationStore.emit('change', state.slice())
  }, 5000)
}

NotificationStore.subscribe = function(handler) {
  handler(state.slice())
  NotificationStore.on('change', handler)
  return function unsubscribe() {
    NotificationStore.removeListener('change', handler)
  }
}

module.exports = NotificationStore