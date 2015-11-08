'use strict';

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const radio = require('radio-stream')
const config = require('../../config')
const db = require('../models')
const stream = new radio.ReadStream(config.shoutCastUrl)

var playing = {}
var history = []

db.Song.find().sort('-_id').limit(30).exec(function(err, docs) {
  history = docs.reverse()
  process.send({ history })
})

stream.on('connect', () => console.log('Connected to SHOUTcast server'))
stream.on('error', err => console.log(err))
stream.on('close', process.exit)

stream.on('metadata', function(data) {
  const title = radio.parseMetadata(data).StreamTitle
  const song = { title, date: Date.now() }

  if (!title || title === playing.title) {
    return
  }

  if (song.title !== (history[history.length - 1] || {}).title) {
    history.length === 30 && history.splice(0, 1)
    history.push(song)
  }

  playing = song

  process.send({ playing, history })
  io.emit('metadata', { playing })

  db.Song.findOne().sort('-_id').exec(function(err, doc) {
    if (!doc || (doc && doc.title !== title)) {
      new db.Song({ title }).save()
    }
  })
})