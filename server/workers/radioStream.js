'use strict'

const {Observable} = require('rxjs')
const hub = require('clusterhub')
const sio = require('socket.io-emitter')
const ReadStream = require('../utils/ReadStream')
const {Song} = require('../models')
const {shoutCastUrls, shoutCastOnline} = require('../../config')

const io = sio({host: '127.0.0.1', port: 6379})

const setRecent = history => {
  const recent = history.slice(history.length - 30)
  hub.set('recent', recent)
}

const setMostPlaying = history => {
  const playCountMap = {}
  for (let song of history) {
    playCountMap[song.title] = (playCountMap[song.title] || 0) + 1
  }
  const mostPlayed = Object.keys(playCountMap)
    .sort((a, b) => playCountMap[b] - playCountMap[a])
    .slice(0, 50)
    .map(title => ({title, playCount: playCountMap[title]}))

  hub.set('mostPlayed', mostPlayed)
}

const setPlaying = history => {
  const playing = history[history.length - 1]
  hub.set('playing', playing)
  io.emit('metadata', {playing})
}

const connect = (url, history) => {
  const stream = new ReadStream(url)

  stream.on('connect', () => console.log('Connected to SHOUTcast server'))
  stream.on('error', err => console.error(err))
  stream.on('close', () => {
    console.log('SHOUTcast server disconnected')
    setTimeout(() => connect(url, history), 10000)
  })

  const getPreviousTitle = history => (history[history.length - 1] || {}).title

  const playing$ = Observable.fromEvent(stream, 'metadata')
    .map(data => data.StreamTitle)
    .filter(title => title)
    .distinctUntilChanged()
    .map(title => {
      const [artist, song] = title.split(' - ')
      return new Song({title, artist, song})
    })

  const history$ = playing$
    .scan((history, playing) => {
      if (playing.title !== getPreviousTitle(history)) {
        playing.save()
        return [...history, playing]
      }
      return history
    }, history)
    .publishReplay(1)
    .refCount()

  history$.subscribe(setRecent)
  history$.subscribe(setMostPlaying)
  history$.subscribe(setPlaying)
}

Song.find().sort('_id').lean().then(history => {
  setRecent(history)
  setMostPlaying(history)

  if (shoutCastOnline && shoutCastUrls && shoutCastUrls[0]) {
    const url = shoutCastUrls[Math.random() * shoutCastUrls.length | 0]
    connect(url, history)
  }
})
