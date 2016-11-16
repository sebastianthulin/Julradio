'use strict'

const hub = require('clusterhub')
const sio = require('socket.io-emitter')
const {SongRequest} = require('../models')

const io = sio({host: '127.0.0.1', port: 6379})
let requests = []

SongRequest.find({granted: {$ne: null}}).select('-ip').sort('-_id').limit(50).then(docs => {
  requests = docs.reverse()
  hub.set('songRequests', requests)
})

hub.on('songRequests:granted', id => {
  SongRequest.findById(id).select('-ip').then(request => {
    requests = [...requests, request]
    hub.set('songRequests', requests)
    io.emit('feedItem', request)
  })
})

hub.on('songRequests:delete', id => {
  SongRequest.findById(id).exec().then(request => {
    const index = requests.findIndex(request => request._id == id)
    if (index !== -1) {
      requests = requests.slice()
      requests.splice(index, 1)
      hub.set('songRequests', requests)
      request.remove()
    }
  })
})
