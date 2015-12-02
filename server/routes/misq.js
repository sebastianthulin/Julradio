'use strict';

const express = require('express')
const router = express.Router()
const share = require('../share')
const db = require('../models')

var playing

share.on('RadioStream', function(data) {
  if (data.playing) {
    playing = data.playing.title
  }
})

router.get('/activate/:UserActivationId', function(req, res, next) {
  db.UserActivation.findById(req.params.UserActivationId, function(err, doc) {
    if (err || !doc) return next()
    db.User.findByIdAndUpdate(doc.user, {
      activated: true
    }).exec().then(function() {
      doc.remove()
      req.session.uid = doc.user
      res.redirect('/')
    }).catch(next)
  })
})

router.get('/inc/now_playing.php', function(req, res) {
  res.send(playing || 'failed to connect')
})

module.exports = router