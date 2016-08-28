'use strict'

const express = require('express')
const router = express.Router()
const share = require('../share')
const db = require('../models')

let playing

share.on('RadioStream', data => {
  if (data.playing) {
    playing = data.playing.title
  }
})

router.get('/activate/:UserActivationId', (req, res, next) => {
  db.UserActivation.findById(req.params.UserActivationId, (err, doc) => {
    if (err || !doc) return next()
    db.User.findByIdAndUpdate(doc.user, {
      activated: true
    }).exec().then(() => {
      doc.remove()
      req.session.uid = doc.user
      res.redirect('/')
    }).catch(next)
  })
})

router.get('/inc/now_playing.php', (req, res) => {
  res.send(playing || 'failed to connect')
})

module.exports = router
