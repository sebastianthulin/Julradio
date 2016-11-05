'use strict'

const hub = require('clusterhub')
const sio = require('socket.io-emitter')
const {Song} = require('../models')
const ReadStream = require('../services/ReadStream')
const config = require('../../config')

const io = sio({host: '127.0.0.1', port: 6379})
const urls = config.shoutCastUrls

let playing = {}
let history = []

Song.find().sort('-_id').limit(30).exec((err, docs) => {
  history = docs.reverse()
  hub.set('radioStream', {history})
})

if (config.shoutCastOnline && urls && urls[0]) {
  const url = urls[Math.random() * urls.length | 0]
  const stream = new ReadStream(url)
  stream.on('connect', () => console.log('Connected to SHOUTcast server'))
  stream.on('error', err => console.log(err))
  stream.on('close', process.exit)

  stream.on('metadata', data => {
    const title = data.StreamTitle
    const song = new Song({
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

    hub.set('nowPlaying', playing.title)
    hub.set('radioStream', {playing, history})
    io.emit('metadata', {playing})

    Song.findOne().sort('-_id').exec((err, doc) => {
      if (!doc || (doc && doc.title !== title)) {
        song.save()
      }
    })
  })
}
