'use strict';

var radio = require('radio-stream')
var io = require('../server').io
var metadata = {}

var stream = radio.createReadStream('http://s5.voscast.com:7346')

stream.on('connect', function() {
  console.log('connected')
})

stream.on('metadata', function(data) {
  var title = radio.parseMetadata(data).StreamTitle
  if (title !== metadata.current) {
    metadata.previous = metadata.current
    metadata.current = title
    io.emit('metadata', metadata)
  }
  console.log(title)
})

module.exports = function(socket) {
  socket.emit('metadata', metadata)
}