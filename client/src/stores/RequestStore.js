const { EventEmitter } = require('events')
const request = require('superagent')
const socket = require('../services/socket')
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

RequestStore.getRequests = function() {
  return new Promise(function(resolve, reject) {
    request.get('/api/request').then(({ body }) => resolve(body), reject)
  })
}

RequestStore.subscribe = function(handler) {
  handler(requests)
  RequestStore.on('tweets', handler)
  return function unsubscribe() {
    RequestStore.removeListener('tweets', handler)
  }
}

module.exports = RequestStore