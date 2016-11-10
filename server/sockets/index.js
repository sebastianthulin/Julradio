'use strict'

const broadcast = require('./broadcast')
const chat = require('./chat')

const socketHandler = socket => {
  socket.userId = socket.request.session.uid
  socket.ip = socket.request.connection.remoteAddress || socket.request['x-forwarded-for']
  broadcast(socket)
  if (socket.userId) {
    socket.join(socket.userId)
    chat(socket)
  }
}

module.exports = socketHandler
