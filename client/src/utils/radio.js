const radio = {}
const listeners = []
const urls = process.env.shoutCastUrls
const audio = new Audio

radio.setSource = source => {
  audio.src = source
}

radio.play = () => {
  return new Promise((_, reject) => {
    audio.play()
    audio.onerror = reject
  })
}

radio.pause = () => {
  audio.pause()
}

radio.setVolume = vol => {
  audio.volume = vol
}

radio.onConnection = cb => {
  listeners.push(cb)
}

const handleConnection = evt => {
  const connected = evt.type === 'playing'
  listeners.forEach(cb => cb(connected))
}

audio.addEventListener('playing', handleConnection)
audio.addEventListener('pause', handleConnection)
audio.addEventListener('ended', handleConnection)
audio.addEventListener('suspend', handleConnection)

module.exports = radio
