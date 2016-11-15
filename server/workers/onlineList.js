'use strict'

const {Observable} = require('rxjs')
const hub = require('clusterhub')
const sio = require('socket.io-emitter')

const io = sio({host: '127.0.0.1', port: 6379})

const onlineList$ = Observable.of([])
  .merge(
    Observable.fromEvent(hub, 'userConnect').map(user => [user, true]),
    Observable.fromEvent(hub, 'userDisconnect').map(user => [user, false])
  )
  .scan((onlineList, [user, connected]) => {
    if (connected) {
      return [user, ...onlineList]
    }
    const i = onlineList.findIndex(u => u._id == user._id)
    if (i > -1) {
      return [...onlineList.slice(0, i), ...onlineList.slice(i + 1, onlineList.length)]
    }
    return onlineList
  })
  .distinctUntilChanged()
  .map(list => list.filter((user, i) => list.findIndex(u => u._id == user._id) === i))
  .scan((curr, next) => curr.length === next.length ? curr : next, [])
  .distinctUntilChanged()

onlineList$.subscribe(onlineList => {
  hub.set('onlineList', onlineList)
  io.emit('onlineList', onlineList)
})
