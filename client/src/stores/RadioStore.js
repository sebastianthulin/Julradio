const {EventEmitter} = require('events')
const socket = require('../services/socket')
const Radio = new EventEmitter
const audio = new Audio
const localStorage = window.localStorage || {}
const urls = process.env.shoutCastUrls

const state = {
  currentlyPlaying: {},
  history: [],
  playing: false,
  onair: false,
  volume: null
}

Radio.play = () => {
  const url = urls[Math.floor(Math.random() * urls.length)]
  audio.src = url + '/;'
  audio.play()
  Radio.emit('playing', true)
  state.playing = true
  try {
    localStorage.playing = 1
  } catch (_) {}
}

Radio.pause = () => {
  audio.pause()
  Radio.emit('playing', false)
  state.playing = false
  try {
    localStorage.playing = 0
  } catch (_) {}
}

Radio.toggle = () => {
  audio.paused ? Radio.play() : Radio.pause()
}

Radio.toggleMute = () => {
  Radio.setVolume(audio.volume > 0 ? 0 : 1)
}

Radio.setVolume = vol => {
  vol = vol > 1 ? 1 : vol < 0 ? 0 : vol
  audio.volume = state.volume = vol
  try {
    localStorage.volume = vol
  } catch (_) {}
  Radio.emit('volume', vol)
}

Radio.subscribe = (event, handler) => {
  handler(state[event])
  Radio.on(event, handler)
  return () => {
    Radio.removeListener(event, handler)
  }
}

socket.on('metadata', ({playing, history}) => {
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

audio.addEventListener('playing', () => {
  state.onair = true
  Radio.emit('onair', true)
})

audio.addEventListener('pause', () => {
  state.onair = false
  Radio.emit('onair', false)
})

Radio.setVolume(localStorage.volume || 1)
localStorage.playing == 1 && Radio.play()

module.exports = Radio
