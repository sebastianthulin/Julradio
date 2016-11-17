'use strict'

const {Observable} = require('rxjs')
const hub = require('clusterhub')
const sio = require('socket.io-emitter')
const ReadStream = require('../utils/ReadStream')
const {Song} = require('../models')
const {shoutCastUrls, shoutCastOnline} = require('../../config')

const io = sio({host: '127.0.0.1', port: 6379})

const connect = (url, history) => {
  const stream = new ReadStream(url)

  stream.on('connect', () => console.log('Connected to SHOUTcast server'))
  stream.on('error', err => console.error(err))
  stream.on('close', () => {
    console.log('SHOUTcast server disconnected')
    setTimeout(() => connect(url, history), 10000)
  })

  const getPreviousTitle = () => (history[history.length - 1] || {}).title

  const playing$ = Observable.fromEvent(stream, 'metadata')
    .map(data => data.StreamTitle)
    .startWith(getPreviousTitle())
    .filter(title => title)
    .distinctUntilChanged()
    .map(title => {
      const [artist, song] = title.split(' - ')
      return new Song({title, artist, song})
    })
  
  playing$.subscribe(playing => {
    if (playing.title !== getPreviousTitle()) {
      history.length === 30 && history.splice(0, 1)
      history.push(playing)
      playing.save()
    }

    hub.set('nowPlaying', playing.title)
    hub.set('radioStream', {playing, history})
    io.emit('metadata', {playing})
  })
}

Song.find().sort('-_id').limit(30).exec((err, docs) => {
  const history = docs.reverse()
  hub.set('radioStream', {history})

  if (shoutCastOnline && shoutCastUrls && shoutCastUrls[0]) {
    const url = shoutCastUrls[Math.random() * shoutCastUrls.length | 0]
    connect(url, history)
  }
})
