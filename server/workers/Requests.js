'use strict'

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const share = require('../share')
const db = require('../models')

let requests = []

db.SongRequest.find({granted: {$ne: null}}).select('-ip').sort('-_id').limit(50).exec((err, docs) => {
  requests = docs.reverse()
  setTimeout(() => share.emit('Requests', requests), 1000)
})

share.on('Requests:granted', id => {
  db.SongRequest.findById(id).select('-ip').exec().then(request => {
    requests.push(request)
    share.emit('Requests', requests)
    io.emit('request', request)
  })
})

share.on('Requests:delete', id => {
  db.SongRequest.findById(id).exec().then(request => {
    const index = requests.findIndex(request => request._id == id)
    if (index !== -1) {
      requests.splice(index, 1)
      share.emit('Requests', requests)
      request.remove().exec()
    }
  })
})
