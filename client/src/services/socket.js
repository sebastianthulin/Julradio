const io = require('socket.io-client')
module.exports = io({
  transports: ['websocket']
})