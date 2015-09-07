var { EventEmitter } = require('events')
var socket = require('../services/socket')
var NewsStore = new EventEmitter
var localStorage = window.localStorage || {}

NewsStore.add = function(opts) {
  var story = {}
  for(var i in opts)
    story[i] = opts[i]
}

NewsStore.update = function(id, opts) {
  
}

NewsStore.delete = function(id) {

}

NewsStore.get = function(callback) {
  socket.emit('get news', function(data) {
    callback(data)
  })
}

module.exports = NewsStore