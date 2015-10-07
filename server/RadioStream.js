'use strict';

const radio = require('radio-stream')
const config = require('../config')
const io = require('../server').io
const metadata = {}
const history = []

const stream = radio.createReadStream(config.shoutCastUrl)

stream.on('connect', () => console.log('connected to radio'))
stream.on('error', err => console.log(err))

stream.on('metadata', function(data) {
  const title = radio.parseMetadata(data).StreamTitle
  if (title !== metadata.current) {
    history.push(title)
    metadata.previous = metadata.current
    metadata.current = title
    io.emit('metadata', metadata)
  }
})

module.exports = socket => socket
  .emit('metadata', metadata)
  .on('get history', function(fn) {
    if (typeof fn === 'function') {
      fn(history)
    }
  })