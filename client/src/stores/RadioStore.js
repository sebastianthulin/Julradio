const { EventEmitter } = require('events')
const socket = require('../services/socket')
const Radio = new EventEmitter
const audio = new Audio
const localStorage = window.localStorage || {}

const state = {
  currentlyPlaying: {},
  history: [],
  playing: false,
  onair: false,
  volume: null
}

Radio.play = function() {
  audio.src = process.env.shoutCastUrl + '/;'
  audio.play()
  Radio.emit('playing', true)
  state.playing = true
  try {
    localStorage.playing = 1
  } catch (e) {}
}

Radio.pause = function() {
  audio.pause()
  Radio.emit('playing', false)
  state.playing = false
  try {
    localStorage.playing = 0
  } catch (e) {}
}

Radio.toggle = function() {
  audio.paused ? Radio.play() : Radio.pause()
}

Radio.toggleMute = function() {
  Radio.setVolume(audio.volume > 0 ? 0 : 1)
}

Radio.setVolume = function(vol) {
  vol = vol > 1 ? 1 : vol < 0 ? 0 : vol
  audio.volume = state.volume = vol
  try {
    localStorage.volume = vol
  } catch (e) {}
  Radio.emit('volume', vol)
}

Radio.subscribe = function(event, handler) {
  handler(state[event])
  Radio.on(event, handler)
  return function unsubscribe() {
    Radio.removeListener(event, handler)
  }
}

socket.on('metadata', function({ playing, history }) {
  if (history) {
    state.history = history
  } else {
    state.history.length === 30 && state.history.splice(0, 1)
    state.history.push(playing)
  }
  state.currentlyPlaying = playing
  Radio.emit('currentlyPlaying', playing)
  Radio.emit('history', state.history)
})

audio.addEventListener('playing', function() {
  state.onair = true
  Radio.emit('onair', true)
})

audio.addEventListener('pause', function() {
  state.onair = false
  Radio.emit('onair', false)
})

Radio.setVolume(localStorage.volume || 1)
localStorage.playing == 1 && Radio.play()

module.exports = Radio