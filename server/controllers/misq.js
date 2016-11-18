'use strict'

const hub = require('clusterhub')
const {User, UserActivation, Picture} = require('../models')
const config = require('../../config')

const pictureRoutes = {}

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
  Picture.findById(id).lean().then(doc => {
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
  hub.get('playing', playing => {
    res.send(playing.title || 'failed to connect')
  })
}
