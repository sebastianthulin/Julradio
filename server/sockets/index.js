'use strict';

const broadcast = require('./broadcast')
const chat = require('./chat')
const datingandstuff = require('./datingandstuff')

module.exports = function(socket) {
  socket.uid = socket.request.session.uid
  console.log('Socket connection on worker ' + process.pid)
  broadcast(socket)
  if (socket.uid) {
    socket.join(socket.uid)
    chat(socket)
    datingandstuff(socket)
  }
}