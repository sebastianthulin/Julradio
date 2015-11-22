'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io

router.post('/', function(req, res, next) {
  new db.SongRequest({
    name: req.body.name,
    song: req.body.song,
    text: req.body.text
  }).save().then(function() {
    res.sendStatus(200)
  }).catch(next)
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
    process.send({
      service: 'Requests',
      data: {
        type: 'granted',
        requestId: id
      }
    })
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/:id', function(req, res, next) {
  db.SongRequest.findByIdAndRemove(req.params.id).exec().then(function() {
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/tweet/:id', function(req, res) {
  if (!req.user.roles.admin) {
    return res.sendStatus(500)
  }
  process.send({
    service: 'TweetStream',
    data: {
      type: 'delete',
      id: req.params.id
    }
  })
  res.sendStatus(200)
})

module.exports = router