'use strict'

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const ReadStream = require('../services/ReadStream')
const config = require('../../config')
const share = require('../share')
const db = require('../models')
const urls = config.shoutCastUrls

let playing = {}
let history = []

db.Song.find().sort('-_id').limit(30).exec((err, docs) => {
  history = docs.reverse()
  setTimeout(() => share.emit('RadioStream', {history}), 1000)
})

if (!urls || !urls[0]) {
  return
}

const url = urls[Math.floor(Math.random() * urls.length)]
const stream = new ReadStream(url)
stream.on('connect', () => console.log('Connected to SHOUTcast server'))
stream.on('error', err => console.log(err))
stream.on('close', process.exit)

stream.on('metadata', data => {
  const title = data.StreamTitle
  const song = new db.Song({
    title,
    artist: title.split(' - ')[0],
    song: title.split(' - ')[1]
  })

  if (!title || title === playing.title) {
    return
  }

  if (song.title !== (history[history.length - 1] || {}).title) {
    history.length === 30 && history.splice(0, 1)
    history.push(song)
  }

  playing = song

  share.emit('RadioStream', {playing, history})
  io.emit('metadata', {playing})

  db.Song.findOne().sort('-_id').exec((err, doc) => {
    if (!doc || (doc && doc.title !== title)) {
      song.save()
    }
  })
})
