'use strict';

const radio = require('radio-stream')
const config = require('../config')
const io = require('../server').io
const db = require('./models')

var history = []
var playing = {}

db.Song.find().sort('-_id').limit(30).exec(function(err, docs) {
  var titles = docs.map(doc => doc.title)
  history = docs.reverse()
})

const stream = radio.createReadStream(config.shoutCastUrl)

stream.on('connect', () => console.log('connected to radio'))
stream.on('error', err => console.log(err))
stream.on('close', function() {
  console.log('___________RADIO CONNECTION CLOSED___________')
})

stream.on('metadata', function(data) {
  const title = radio.parseMetadata(data).StreamTitle
  const song = { title, date: Date.now() }
  if (!title || title === playing.title) {
    return
  }

  if (song.title !== (history[history.length - 1] || {}).title) {
    history = history.slice(history.length > 29 && 30)
    history.push(song)
  }

  playing = song
  io.emit('metadata', { playing })

  db.Song.findOne().sort('-_id').exec(function(err, doc) {
    if (!doc || doc.title !== title) {
      new db.Song({ title }).save()
    }
  })
})

module.exports = socket => socket
  .emit('metadata', { playing, history })