var { EventEmitter } = require('events')
var socket = require('../services/socket')
var Radio = new EventEmitter
var audio = new Audio
var localStorage = window.localStorage || {}

var store = {
  playing: false,
  metadata: {},
  history: []
}

function handleMetadata(data) {
  store.metadata = data
  store.history.push(data.current)
  Radio.emit('metadata', data)
  Radio.emit('history', store.history)
}

Radio.play = function() {
  audio.src = 'http://s5.voscast.com:7346/;'
  audio.play()
  Radio.emit('playing', true)
  store.playing = true
  localStorage.playing = 1
}

Radio.pause = function() {
  audio.pause()
  Radio.emit('playing', false)
  store.playing = false
  localStorage.playing = 0
}

Radio.toggle = function() {
  audio.paused ? Radio.play() : Radio.pause()
}

Radio.subscribe = function(event, handler) {
  handler(store[event])
  Radio.on(event, handler)
  return function unsubscribe() {
    Radio.removeListener(event, handler)
  }
}

Radio.subscribe.history = function(handler) {
  socket.emit('get history', history => {
    store.history = history
    Radio.emit('history', history)
  })
  return Radio.subscribe('history', handler)
}

socket.on('metadata', handleMetadata)

localStorage.playing == 1 && Radio.play()

module.exports = Radio