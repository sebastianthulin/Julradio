'use strict'

const hub = require('clusterhub')
const {User, UserActivation, Picture} = require('../models')
const config = require('../../config')

const pictureRoutes = {}

exports.fetchUser = (req, res, next) => {
  req.userId = req.session.uid
  res.setHeader('Expires', '-1')
  res.setHeader('Cache-Control', 'must-revalidate, private')
  if (!req.userId) return next()
  User.findById(req.userId).select('-hash').lean().exec().then(user => {
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

exports.renderPage = (req, res) => {
  res.render('main', {
    user: req.user,
    analytics: config.analytics,
    playerLess: req.headers['user-agent'] === 'Julradio Android App'
  })
}

exports.showPicture = (req, res) => {
  const id = req.params.id
  if (pictureRoutes[id]) {
    return res.redirect(pictureRoutes[id])
  }
  Picture.findById(id).exec().then(doc => {
    pictureRoutes[id] = '/i/' + doc._id + doc.extension
    res.redirect(pictureRoutes[id])
  }).catch(() => {
    res.sendStatus(404)
  })
}

exports.activateUser = (req, res, next) => {
  UserActivation.findById(req.params.userActivationId, (err, doc) => {
    if (err || !doc) return next()
    User.findByIdAndUpdate(doc.user, {
      activated: true
    }).exec().then(() => {
      doc.remove()
      req.session.uid = doc.user
      res.redirect('/')
    }).catch(next)
  })
}

exports.showNowPlaying = (req, res) => {
  hub.get('nowPlaying', nowPlaying => {
    res.send(nowPlaying || 'failed to connect')
  })
}
