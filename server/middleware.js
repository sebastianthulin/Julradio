'use strict'

const sessions = require('client-sessions')
const bodyParser = require('body-parser')
const {User} = require('./models')
const config = require('../config')
const {SENSITIVE_USER_SELECT} = require('./constants')

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

exports.fetchUser = (req, res, next) => {
  if (!req.session.uid) {
    return next()
  }
  User.findById(req.session.uid).select(SENSITIVE_USER_SELECT).lean().then(user => {
    if (!user || (user && user.banned)) {
      // Disauth user
      throw new Error()
    }

    req.user = user
    next()
  }).catch(() => {
    req.session.uid = undefined
    next()
  })
}

exports.signedIn = (req, res, next) => {
  req.userId = req.session.uid
  if (req.userId) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
}

exports.role = role => (req, res, next) => {
  exports.fetchUser(req, res, () => {
    if (req.user && req.user.roles[role]) {
      next()
    } else {
      next(new Error('UNAUTHORISED'))
    }
  })
}
