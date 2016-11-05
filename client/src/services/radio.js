const radio = {}
const listeners = []
const urls = process.env.shoutCastUrls
const audio = new Audio
const url = urls[Math.random() * urls.length | 0] + '/;'
audio.src = url

radio.play = () => {
  return audio.play()
}

radio.pause = () => {
  audio.pause()
}

radio.setVolume = vol => {
  audio.volume = vol
}

radio.onceConnection = cb => {
  listeners.push(cb)
}

const handleConnection = evt => {
  const connected = evt.type === 'playing'
  listeners.forEach(cb => cb(connected))
  listeners.length = 0
}

audio.addEventListener('playing', handleConnection)
audio.addEventListener('pause', handleConnection)

module.exports = radio
