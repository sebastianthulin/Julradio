'use strict'

const share = require('../share')

let playing = {}
let history = []
let tweets = []
let songRequests = []
let reservations = []
let requests = []

const updateRequests = () => {
  requests = [...tweets, ...songRequests]
  requests.sort((a, b) => {
    return new Date(b.granted || b.date) - new Date(a.granted || a.date)
  })
  requests.splice(50)
}

share.on('RadioStream', data => {
  history = data.history
  if (data.playing) {
    playing = data.playing
  }
})

share.on('TweetStream', data => {
  tweets = data
  updateRequests()
})

share.on('Requests', data => {
  songRequests = data
  updateRequests()
})

share.on('Reservations', data => {
  reservations = data
})

module.exports = socket => socket
  .emit('metadata', {playing, history})
  .emit('requests', requests)
  .emit('reservations', reservations)
