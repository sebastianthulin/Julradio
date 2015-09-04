var { EventEmitter } = require('events')
var Radio = new EventEmitter
var audio = new Audio
var localStorage = window.localStorage || {}

Radio.play = function() {
  audio.src = 'http://s5.voscast.com:7346/;'
  audio.play()
  Radio.emit('playing', true)
  localStorage.playing = 1
}

Radio.pause = function() {
  audio.pause()
  Radio.emit('playing', false)
  localStorage.playing = 0
}

Radio.toggle = function() {
  audio.paused ? Radio.play() : Radio.pause()
}

Radio.subscribe = function(handler) {
  handler(!audio.paused)
  Radio.on('playing', handler)
  return function unsubscribe() {
    Radio.removeListener('playing', handler)
  }
}

if (localStorage.playing == 1) {
  Radio.play()
}

module.exports = Radio