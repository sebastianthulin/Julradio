const { EventEmitter } = require('events')
const UIStore = new EventEmitter
const states = {
  NowPlaying: {
    CURRENT_ONLY: true,
    HISTORY: false
  }
}

UIStore.set = function(UI, UIState) {
  states[UI] = {[UIState]: true}
  UIStore.emit(UI, states[UI])
}

UIStore.subscribe = function(UI, handler) {
  handler(states[UI])
  UIStore.on(UI, handler)
  return function() {
    UIStore.removeListener(UI, handler)
  }
}

module.exports = UIStore