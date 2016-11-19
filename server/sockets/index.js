'use strict'

const hub = require('clusterhub')
const {User} = require('../models')
const {apiError} = require('../utils/apiError')
const broadcast = require('./broadcast')
const chat = require('./chat')
const comments = require('./comments')
const {SAFE_USER_SELECT} = require('../constants')

const getXForwardedFor = socket => {
  const ips = socket.request.headers['x-forwarded-for']
  return ips && ips.split(', ')[0]
}

const socketHandler = socket => {
  const listen = socket.on.bind(socket)

  socket.userId = socket.request.session.uid
  socket.ip = getXForwardedFor(socket) || socket.request.connection.remoteAddress

  socket.on = (event, cb) => {
    listen(event, async (data, respond) => {
      try {
        await cb(data, body => {
          typeof respond === 'function' && respond({body})
        })
      } catch (err) {
        if (err.isApiError) {
          typeof respond === 'function' && respond({err})
        } else {
          console.error(err)
          typeof respond === 'function' && respond({err: apiError('UNKNOWN_ERROR')})
        }
      }
    })
  }

  broadcast(socket)
  comments(socket)

  if (socket.userId) {
    socket.join(socket.userId)
    chat(socket)

    User.findById(socket.userId).select(SAFE_USER_SELECT).lean().then(user => {
      // the time it takes to fetch user document
      // might fuck up socket disconnection and comment creation.
      socket.user = user
      socket.isAdmin = !!(user.roles && user.roles.admin)
      hub.emit('userConnect', user)
      socket.on('disconnect', () => {
        hub.emit('userDisconnect', user)
      })
    })
  }
}

module.exports = socketHandler
