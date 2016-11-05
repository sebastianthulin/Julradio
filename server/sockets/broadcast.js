'use strict'

const hub = require('clusterhub')

const socketHandler = socket => {
  hub.get('radioStream', m => socket.emit('metadata', m))
  hub.get('reservations', r => socket.emit('reservations', r))

  hub.get('songRequests', songRequests => {
    hub.get('tweetStream', tweets => {
      const requests = [...tweets, ...songRequests]
      requests.sort((a, b) => new Date(b.granted || b.date) - new Date(a.granted || a.date))
      requests.splice(50)
      socket.emit('requests', requests)
    })
  })
}

module.exports = socketHandler
