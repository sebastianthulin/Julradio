'use strict';

var playing = {}
var history = []
var tweets = []
var songRequests = []
var reservations = []
var requests = []

function updateRequests() {
  requests = [...tweets, ...songRequests]
  requests.sort((a, b) => {
    return new Date(b.granted || b.date) - new Date(a.granted || a.date)
  })
  requests.splice(50)
}

process.on('message', function(message) {
  if (message.service === 'RadioStream') {
    history = message.data.history
    if (message.data.playing) {
      playing = message.data.playing
    }
  } else if (message.service === 'TweetStream') {
    tweets = message.data
    updateRequests()
  } else if (message.service === 'Requests') {
    songRequests = message.data
    updateRequests()
  } else if (message.service === 'Reservations') {
    reservations = message.data
  }
})

module.exports = socket => socket
  .emit('metadata', { playing, history })
  .emit('requests', requests)
  .emit('reservations', reservations)