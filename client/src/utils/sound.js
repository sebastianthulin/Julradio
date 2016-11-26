const sound = {}

sound.format = '.ogg'

sound.play = fileName => {
  const snd = new Audio()
  snd.src = '/sounds/' + fileName + sound.format
  snd.play()
}

module.exports = sound
