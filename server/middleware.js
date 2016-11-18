'use strict'

const sessions = require('client-sessions')
const bodyParser = require('body-parser')
const {User} = require('./models')
const {apiError} = require('./utils/apiError')
const {SENSITIVE_USER_SELECT} = require('./constants')
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
    req.userId = undefined
    next()
  })
}

exports.signedIn = (req, res, next) => {
  if (req.userId) {
    next()
  } else {
    next(apiError('NOT_SIGNED_IN', 401))
  }
}

exports.role = role => (req, res, next) => {
  exports.fetchUser(req, res, () => {
    if (req.user && req.user.roles[role]) {
      next()
    } else {
      next(apiError('UNAUTHORISED', 401))
    }
  })
}
