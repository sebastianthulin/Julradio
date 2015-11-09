const { EventEmitter } = require('events')
const socket = require('../services/socket')
const request = require('../services/request')
const RequestStore = new EventEmitter

var requests = []

socket.on('tweets', function(data) {
  requests = data
  RequestStore.emit('tweets', requests)
})

socket.on('tweet', function(tweet) {
  requests.unshift(tweet)
  if (requests.length === 51) {
    requests.splice(50, 1)
  }
  RequestStore.emit('tweets', requests)
})

RequestStore.request = function(opts) {
  return request.post('/api/request', opts)
}

RequestStore.accept = function(id) {
  return request.put('/api/request/' + id)
}

RequestStore.deny = function(id) {
  return request.del('/api/request/' + id)
}

RequestStore.getRequests = function() {
  return request.get('/api/request')
}

RequestStore.getGranted = function() {
  return request.get('/api/request/granted')
}

RequestStore.subscribe = function(handler) {
  handler(requests)
  RequestStore.on('tweets', handler)
  return function unsubscribe() {
    RequestStore.removeListener('tweets', handler)
  }
}

module.exports = RequestStore