const Sound = {}

Sound.format = '.ogg'

Sound.play = function(sound) {
  const snd = new Audio()
  snd.src = '/sounds/' + sound + this.format
  snd.play()
}

module.exports = Sound