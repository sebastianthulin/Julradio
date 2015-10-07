'use strict';

module.exports = function(socket) {
  var uid = socket.request.session.uid
  if (!uid) {
    return
  }

  socket.join(uid)

  socket.on('message', function(opts) {
    
  })
}