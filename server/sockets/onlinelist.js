'use strict';

const db = require('../models')
const io = require('../../server').io

var onlinelist = []

function userJoin(socket) {
  process.send({
    service: 'OnlineList',
    data: {
      type: 'join',
      userId: socket.uid
    }
  })
}

function userLeave(socket) {
  process.send({
    service: 'OnlineList',
    data: {
      type: 'leave',
      userId: socket.uid
    }
  })
}

function handler(socket) {
  userJoin(socket)
  process.send({
    service: 'OnlineList',
    data: {
      type: 'get'
    }
  })
  socket.on('disconnect', function() {
    userLeave(socket)
  })
  socket.emit('onlinelist', onlinelist)
}

process.on('message', function(message) {
  if (message.service === 'OnlineList') {
    onlinelist = message.data
  }
})

module.exports = handler