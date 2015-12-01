'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

var playing = ''

process.on('message', function(message) {
  if (message.service === 'RadioStream' && message.data.playing) {
    playing = message.data.playing.title
  }
})

router.get('/activate/:UserActivationId', function(req, res, next) {
  db.UserActivation.findById(req.params.UserActivationId, function(err, doc) {
    if (err || !doc) {
      next()
    } else {
      doc.remove()
      req.session.uid = doc.user
      res.redirect('/')
    }
  })
})

router.get('/inc/now_playing.php', function(req, res) {
  res.send(playing || 'failed to connect')
})

module.exports = router