'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io
const share = require('../share')
const performAction = require('../services/performAction')

router.post('/', function(req, res, next) {
  const request = new db.SongRequest({
    name: req.body.name,
    song: req.body.song,
    text: req.body.text
  })

  request.validate(function(err) {
    if (err) {
      return next(new Error('MISSING_FIELD'))
    }
    performAction(req.ip , 'requestsong').then(function() {
      return request.save()
    }).then(function() {
      res.sendStatus(200)
    }).catch(next)
  })
})

router.use(function(req, res, next) {
  if (req.user && req.user.roles.radioHost) {
    next()
  } else {
    res.sendStatus(500)
  }
})

router.get('/', function(req, res, next) {
  db.SongRequest.find({granted: null}).exec()
    .then(res.send.bind(res))
    .catch(next)
})

router.put('/:id', function(req, res, next) {
  const id = req.params.id
  db.SongRequest.findById(id).exec().then(function(request) {
    if (request && !request.granted) {
      request.granted = Date.now()
      return request.save()
    }
    throw new Error('SONG_REQUEST_INVALID')
  }).then(function() {
    share.emit('Requests:granted', id)
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/all', function(req, res, next) {
  db.SongRequest.remove({granted: null}).exec().then(function() {
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/:id', function(req, res, next) {
  db.SongRequest.findByIdAndRemove(req.params.id).exec().then(function() {
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/accepted/:id', function(req, res) {
  if (!req.user.roles.admin) {
    res.sendStatus(500)
  } else {
    share.emit('Requests:delete', req.params.id)
    res.sendStatus(200)
  }
})

router.delete('/tweet/:id', function(req, res) {
  if (!req.user.roles.admin) {
    res.sendStatus(500)
  } else {
    share.emit('TweetStream:delete', req.params.id)
    res.sendStatus(200)
  }
})

module.exports = router