'use strict'

const hub = require('clusterhub')
const {User} = require('../models')
const {SAFE_USER_SELECT} = require('../constants')

const socketHandler = socket => {
  hub.get('radioStream', metadata => socket.emit('metadata', metadata))
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

  if (socket.userId) {
    User.findById(socket.userId).select(User.SAFE_SELECT).lean().then(user => {
      hub.emit('userConnect', user)
      socket.on('disconnect', () => {
        hub.emit('userDisconnect', user)
      })
    })
  }
}

module.exports = socketHandler
