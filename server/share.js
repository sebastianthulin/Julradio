'use strict'

const share = {}
const handlers = {}

share.on = (event, handler) => {
  handlers[event] = handlers[event] || []
  handlers[event].push(handler)
  //process.send({subscribe: event})
}

share.emit = (event, data) => {
  process.send({event, data})
}

process.on('message', data => {
  if (data.event) {
    handlers[data.event].forEach(a => a(data.data))
  }
})

module.exports = share
