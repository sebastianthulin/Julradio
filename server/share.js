'use strict';

const share = {}
const handlers = {}

share.on = function(event, handler) {
  handlers[event] = handlers[event] || []
  handlers[event].push(handler)
  process.send({subscribe: event})
}

share.emit = function(event, data) {
  process.send({ event, data })
}

process.on('message', function(data) {
  if (data.event) {
    handlers[data.event].forEach(a => a(data.data))
  }
})

module.exports = share