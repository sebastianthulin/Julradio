'use strict';

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const db = require('../models')

var requests = []

db.SongRequest.find({granted: {$ne: null}}).sort('-_id').limit(50).exec(function(err, docs) {
  requests = docs.reverse()
  process.send(requests)
})

function requestGranted(requestId) {
  db.SongRequest.findById(requestId).exec().then(function(request) {
    requests.push(request)
    process.send(requests)
    io.emit('request', request)
  })
}

function requestDelete(requestId) {
  db.SongRequest.findById(requestId).exec().then(function(request) {
    var index = requests.findIndex(request => request._id == requestId)
    if (index !== -1) {
      requests.splice(index, 1)
      process.send(requests)
      request.remove().exec()
    }
  })
}

process.on('message', function(data) {
  switch (data.type) {
    case 'granted':
      requestGranted(data.requestId); break
    case 'delete':
      requestDelete(data.requestId); break
  }
})