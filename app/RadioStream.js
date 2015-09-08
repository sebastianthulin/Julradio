'use strict';

var radio = require('radio-stream')
var io = require('../server').io
var metadata = {}
var history = []

var stream = radio.createReadStream('http://s5.voscast.com:7346')

stream.on('connect', function() {
  console.log('connected to radio')
})

stream.on('metadata', function(data) {
  var title = radio.parseMetadata(data).StreamTitle
  if (title !== metadata.current) {
    history.push(title)
    metadata.previous = metadata.current
    metadata.current = title
    io.emit('metadata', metadata)
  }
})

stream.on('error', function(err) {
  console.log(err)
})

module.exports = function(socket) {
  socket.emit('metadata', metadata)
  socket.on('get history', function(fn) {
    if (typeof fn === 'function') {
      fn(history)
    }
  })
}