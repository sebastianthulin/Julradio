'use strict'

const {Router} = require('express')
const hub = require('clusterhub')
const {User, UserActivation} = require('../models')

const router = Router()

router.get('/activate/:UserActivationId', (req, res, next) => {
  UserActivation.findById(req.params.UserActivationId, (err, doc) => {
    if (err || !doc) return next()
    User.findByIdAndUpdate(doc.user, {
      activated: true
    }).exec().then(() => {
      doc.remove()
      req.session.uid = doc.user
      res.redirect('/')
    }).catch(next)
  })
})

router.get('/inc/now_playing.php', (req, res) => {
  hub.get('nowPlaying', nowPlaying => {
    res.send(nowPlaying || 'failed to connect')
  })
})

module.exports = router
