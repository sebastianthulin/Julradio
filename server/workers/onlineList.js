'use strict'

const {Observable} = require('rxjs')
const hub = require('clusterhub')
const sio = require('socket.io-emitter')

const io = sio({host: '127.0.0.1', port: 6379})

const connection$ = Observable.of({onlineList: []})
  .merge(
    Observable.fromEvent(hub, 'userConnect').map(user => [user, true]),
    Observable.fromEvent(hub, 'userDisconnect').map(user => [user, false])
  )
  .scan(({onlineList}, [user, connected]) => {
    const index = onlineList.findIndex(u => u._id == user._id)
    const nextIndex = onlineList.findIndex((u, i) => i !== index && u._id == user._id)
    const isNew = connected && index === -1
    const didLeave = !connected && nextIndex === -1

    onlineList = connected
      ? [user, ...onlineList]
      : index > -1
      ? [...onlineList.slice(0, index), ...onlineList.slice(index + 1, onlineList.length)]
      : onlineList

    return {onlineList, user, isNew, didLeave}
  })
  .filter(event => event.isNew || event.didLeave)
  .publishReplay(1)
  .refCount()

const onlineList$ = connection$
  .map(event => event.onlineList)
  .map(list => list.filter((user, i) => list.findIndex(u => u._id == user._id) === i))

onlineList$.subscribe(onlineList => {
  hub.set('onlineList', onlineList)
})

connection$.subscribe(event => {
  const change = [event.user, event.isNew]
  io.emit('onlineListChange', change)
})
