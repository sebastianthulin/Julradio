'use strict';

const broadcast = require('./broadcast')
const chat = require('./chat')

module.exports = function(socket) {
  socket.uid = socket.request.session.uid
  broadcast(socket)
  if (socket.uid) {
    socket.join(socket.uid)
    chat(socket)
  }
}