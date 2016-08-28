const socket = require('./socket')
const reload = location.reload.bind(location)
socket.on('disconnect', () => socket.on('connect', reload))

window.disableAutoRefresh = () => {
  socket.off('disconnect')
  socket.off('connect')
  console.info('Auto refresh disabled!')
}
