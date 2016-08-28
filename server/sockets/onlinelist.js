'use strict'

const db = require('../models')
const {io} = require('../')

var onlinelist = []

const userJoin = socket => {
  process.send({
    service: 'OnlineList',
    data: {
      type: 'join',
      userId: socket.uid
    }
  })
}

const userLeave = socket => {
  process.send({
    service: 'OnlineList',
    data: {
      type: 'leave',
      userId: socket.uid
    }
  })
}

const handler = socket => {
  userJoin(socket)
  process.send({
    service: 'OnlineList',
    data: {
      type: 'get'
    }
  })
  socket.on('disconnect', () => {
    userLeave(socket)
  })
  socket.emit('onlinelist', onlinelist)
}

process.on('message', message => {
  if (message.service === 'OnlineList') {
    onlinelist = message.data
  }
})

module.exports = handler
