'use strict'

const hub = require('clusterhub')

const socketHandler = socket => {
  hub.get('playing', playing => socket.emit('playing', playing))
  hub.get('recent', recent => socket.emit('recent', recent))
  hub.get('reservations', rreservations => socket.emit('reservations', rreservations))
  hub.get('onlineList', list => list && socket.emit('onlineList', list))

  hub.get('songRequests', songRequests => {
    hub.get('tweetStream', tweets => {
      const feed = [...tweets, ...songRequests]
      feed.sort((a, b) => new Date(b.granted || b.date) - new Date(a.granted || a.date))
      feed.splice(50)
      socket.emit('feed', feed)
    })
  })
}

module.exports = socketHandler
