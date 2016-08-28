const {EventEmitter} = require('events')
const NotificationStore = new EventEmitter

const state = []

NotificationStore.insert = ({type, from, value}, err) => {
  const id = Math.random()
  const notification = {
    id,
    type,
    from,
    value,
    err,
    key: id,
    y: -80
  }
  state.unshift(notification)
  NotificationStore.emit('change', state.slice())
  setTimeout(NotificationStore.clear.bind(null, id), 5000)
}

NotificationStore.error = opts => NotificationStore.insert(opts, true)

NotificationStore.clear = id => {
  for (let i = state.length; i--;) {
    if (state[i].id === id) {
      state.splice(i, 1)
    }
  }
  NotificationStore.emit('change', state.slice())
}

NotificationStore.subscribe = handler => {
  handler(state.slice())
  NotificationStore.on('change', handler)
  return () => {
    NotificationStore.removeListener('change', handler)
  }
}

module.exports = NotificationStore
