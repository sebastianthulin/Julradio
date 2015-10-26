var io = require('socket.io-client')
module.exports = io()

module.exports.on('lol', function(data) {
  console.log(data)
})