const Sound = {}

Sound.format = '.ogg'

Sound.play = sound => {
  const snd = new Audio()
  snd.src = '/sounds/' + sound + Sound.format
  snd.play()
}

module.exports = Sound
