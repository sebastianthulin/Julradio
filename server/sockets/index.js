'use strict';

const broadcast = require('./broadcast')
const chat = require('./chat')
const datingandstuff = require('./datingandstuff')

module.exports = function(socket) {
  const uid = socket.request.session.uid
  console.log('Socket connection on worker ' + process.pid)
  broadcast(socket)
  if (uid) {
    socket.join(uid)
    chat(socket)
    datingandstuff(socket)
  }
}