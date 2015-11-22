const { EventEmitter } = require('events')
const socket = require('../services/socket')
const request = require('../services/request')
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

RequestStore.deleteTweet = id =>
  request.del('/api/request/tweet/' + id)

RequestStore.create = opts =>
  request.post('/api/request', opts)

RequestStore.accept = id =>
  request.put('/api/request/' + id)

RequestStore.deny = id =>
  request.del('/api/request/' + id)

RequestStore.fetch = () =>
  request.get('/api/request')

RequestStore.subscribe = function(handler) {
  handler(requests)
  RequestStore.on('requests', handler)
  return function unsubscribe() {
    RequestStore.removeListener('requests', handler)
  }
}

module.exports = RequestStore