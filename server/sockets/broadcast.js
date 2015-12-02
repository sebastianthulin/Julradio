'use strict';

const share = require('../share')

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

share.on('RadioStream', function(data) {
  history = data.history
  if (data.playing) {
    playing = data.playing
  }
})

share.on('TweetStream', function(data) {
  tweets = data
  updateRequests()
})

share.on('Requests', function(data) {
  songRequests = data
  updateRequests()
})

share.on('Reservations', function(data) {
  reservations = data
})

module.exports = socket => socket
  .emit('metadata', { playing, history })
  .emit('requests', requests)
  .emit('reservations', reservations)