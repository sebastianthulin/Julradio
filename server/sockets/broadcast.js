'use strict'

const hub = require('clusterhub')
const {User} = require('../models')

const socketHandler = socket => {
  hub.get('radioStream', m => socket.emit('metadata', m))
  hub.get('reservations', r => socket.emit('reservations', r))
  hub.get('onlineList', l => socket.emit('onlineList', l))

  hub.get('songRequests', songRequests => {
    hub.get('tweetStream', tweets => {
      const requests = [...tweets, ...songRequests]
      requests.sort((a, b) => new Date(b.granted || b.date) - new Date(a.granted || a.date))
      requests.splice(50)
      socket.emit('requests', requests)
    })
  })

  if (socket.userId) {
    User.findById(socket.userId).select('username').lean().then(({username}) => {
      hub.emit('userConnect', username)
      socket.on('disconnect', () => {
        hub.emit('userDisconnect', username)
      })
    })
  }
}

module.exports = socketHandler
