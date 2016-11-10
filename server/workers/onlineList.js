'use strict'

const {Observable} = require('rxjs')
const hub = require('clusterhub')
const sio = require('socket.io-emitter')

const io = sio({host: '127.0.0.1', port: 6379})

const onlineList$ = Observable.of([])
  .merge(
    Observable.fromEvent(hub, 'userConnect').map(username => [username, true]),
    Observable.fromEvent(hub, 'userDisconnect').map(username => [username, false])
  )
  .scan((onlineList, [username, connected]) => {
    if (connected) {
      return [username, ...onlineList]
    }
    const i = onlineList.indexOf(username)
    if (i > -1) {
      return [...onlineList.slice(0, i), ...onlineList.slice(i + 1, onlineList.length)]
    }
    return onlineList
  })
  .distinctUntilChanged()
  .map(list => list.filter((username, i) => list.indexOf(username) === i))
  .scan((curr, next) => curr.length === next.length ? curr : next, [])
  .distinctUntilChanged()

onlineList$.subscribe(onlineList => {
  hub.set('onlineList', onlineList)
  io.emit('onlineList', onlineList)
})
