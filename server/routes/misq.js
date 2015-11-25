'use strict';

const express = require('express')
const router = express.Router()

var playing = ''

process.on('message', function(message) {
  if (message.service === 'RadioStream' && message.data.playing) {
    playing = message.data.playing.title
  }
})

router.get('/inc', function(req, res) {
  res.send(playing)
})

module.exports = router