const io = require('socket.io-client')
const transports = process.env.socketTransports
const socket = io({transports})

socket.fetch = (event, data) => {
  return new Promise((resolve, reject) => {
    socket.emit(event, data, ({err, body}) => {
      err ? reject(err) : resolve(body)
    })
  })
}

module.exports = socket
