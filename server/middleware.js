'use strict';

const sessions = require('client-sessions')
const bodyParser = require('body-parser')
const config = require('../config')

exports.ioify = middleware =>
  (socket, next) =>
    middleware(socket.request, {}, next)

exports.session = sessions({
  cookieName: 'session',
  secret: config.cookieSecret,
  duration: 1000 * 60 * 60 * 24 * 14,
  activeDuration: 1000 * 60 * 60 * 24 * 14
})

exports.body = bodyParser.json()

exports.signedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
}

exports.role = role => (req, res, next) => {
  if (req.user && req.user.roles[role]) {
    next()
  } else {
    next(new Error('UNAUTHORISED'))
  }
}