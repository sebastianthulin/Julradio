'use strict';

var playing = {}
var history = []
var tweets = []
var reservations = []

process.on('message', function(message) {
  if (message.service === 'RadioStream') {
    history = message.data.history
    if (message.data.playing) {
      playing = message.data.playing
    }
  } else if (message.service === 'TweetStream') {
    tweets = message.data
  } else if (message.service === 'Reservations') {
    reservations = message.data
  }
})

module.exports = socket => socket
  .emit('metadata', { playing, history })
  .emit('tweets', tweets)
  .emit('reservations', reservations)