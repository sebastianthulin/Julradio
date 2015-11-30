'use strict';

const broadcast = require('./broadcast')
const chat = require('./chat')
const onlinelist = require('./onlinelist')

module.exports = function(socket) {
  socket.uid = socket.request.session.uid
  socket.ip = socket.request.connection.remoteAddress || socket.request['x-forwarded-for']
  broadcast(socket)
  if (socket.uid) {
    socket.join(socket.uid)
    chat(socket)
    onlinelist(socket)
  }
}