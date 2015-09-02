var socket = require('./socket')
var reload = location.reload.bind(location)
socket.on('reload', reload)
socket.on('disconnect', () => socket.on('connect', reload))

window.disableAutoRefresh = function() {
  socket.off('reload')
  socket.off('disconnect')
  socket.off('connect')
  console.info('Auto refresh disabled!')
}