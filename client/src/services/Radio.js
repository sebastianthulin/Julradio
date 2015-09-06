var { EventEmitter } = require('events')
var socket = require('./socket')
var Radio = new EventEmitter
var audio = new Audio
var localStorage = window.localStorage || {}

var store = {
  playing: false,
  metadata: {}
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

socket.on('metadata', function(data) {
  store.metadata = data
  Radio.emit('metadata', data)
})

if (localStorage.playing == 1) {
  Radio.play()
}

module.exports = Radio