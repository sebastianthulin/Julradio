const { EventEmitter } = require('events')
const UIStore = new EventEmitter

const state = {
  SIDEBAR_OPEN: false
}

UIStore.set = function(UI) {
  state[UI] = true
  UIStore.emit('change', state)
}

UIStore.close = function(UI) {
  state[UI] = false
  UIStore.emit('change', state)
}

UIStore.subscribe = function(handler) {
  handler(state)
  UIStore.on('change', handler)
  return function() {
    UIStore.removeListener('change', handler)
  }
}

module.exports = UIStore