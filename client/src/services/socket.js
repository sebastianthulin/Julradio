const io = require('socket.io-client')
const transports = process.env.socketTransports
module.exports = io({transports})
