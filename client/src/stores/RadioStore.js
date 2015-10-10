const { EventEmitter } = require('events')
const socket = require('../services/socket')
const Radio = new EventEmitter
const audio = new Audio
const localStorage = window.localStorage || {}

const store = {
  playing: false,
  onair: false,
  metadata: {},
  history: [],
  volume: null
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

Radio.setVolume = function(vol) {
  vol = vol > 1 ? 1 : vol < 0 ? 0 : vol
  audio.volume = store.volume = localStorage.volume = vol
  Radio.emit('volume', vol)
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

audio.addEventListener('playing', function() {
  store.onair = true
  Radio.emit('onair', true)
})

audio.addEventListener('pause', function() {
  store.onair = false
  Radio.emit('onair', false)
})

Radio.setVolume(localStorage.volume || 1)
localStorage.playing == 1 && Radio.play()

module.exports = Radio