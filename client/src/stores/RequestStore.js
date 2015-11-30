const { EventEmitter } = require('events')
const socket = require('../services/socket')
const API = require('../services/API')
const RequestStore = new EventEmitter

var requests = []

function handleRequest(request) {
  request.songRequest = !!request.granted
  request.tweet = !request.songRequest
}

socket.on('requests', function(data) {
  requests = data
  requests.forEach(handleRequest)
  RequestStore.emit('requests', requests)
})

socket.on('request', function(request) {
  handleRequest(request)
  requests.unshift(request)
  if (requests.length === 51) {
    requests.splice(50, 1)
  }
  RequestStore.emit('requests', requests)
})

RequestStore.deleteTweet = (id, cb) => API.delete('/request/tweet/' + id, cb)
RequestStore.deleteRequest = (id, cb) => API.delete('/request/accepted/' + id, cb)
RequestStore.create = (opts, cb) => API.post('/request', opts, cb)
RequestStore.accept = (id, cb) => API.put('/request/' + id, cb)
RequestStore.deny = (id, cb) => API.delete('/request/' + id, cb)
RequestStore.fetch = cb => API.get('/request', cb)

RequestStore.subscribe = function(handler) {
  handler(requests)
  RequestStore.on('requests', handler)
  return function unsubscribe() {
    RequestStore.removeListener('requests', handler)
  }
}

module.exports = RequestStore