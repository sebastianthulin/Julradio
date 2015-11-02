'use strict';

var playing = {}
var history = []
var tweets = []

process.on('message', function(message) {
  if (message.service === 'RadioStream') {
    history = message.data.history
    if (message.data.playing) {
      playing = message.data.playing
    }
  } else if (message.service === 'TweetStream') {
    tweets = message.data
  }
})

module.exports = socket => socket
  .emit('metadata', { playing, history })
  .emit('tweets', tweets)