'use strict'

const hub = require('clusterhub')
const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const {SongRequest} = require('../models')
const performAction = require('../services/performAction')

router.use(middleware.body)

router.post('/', (req, res, next) => {
  const request = new SongRequest({
    name: req.body.name,
    song: req.body.song,
    text: req.body.text,
    ip: req.ip
  })

  request.validate(err => {
    if (err) {
      return next(new Error('MISSING_FIELD'))
    }
    performAction(req.ip , 'requestsong').then(() => {
      return request.save()
    }).then(() => {
      res.sendStatus(200)
    }).catch(next)
  })
})

router.use(middleware.role('radioHost'))

router.get('/', (req, res, next) => {
  SongRequest.find({granted: null}).exec()
    .then(res.send.bind(res))
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  SongRequest.findById(id).exec().then(request => {
    if (request && !request.granted) {
      request.granted = Date.now()
      return request.save()
    }
    throw new Error('SONG_REQUEST_INVALID')
  }).then(() => {
    hub.emit('songRequests:granted', id)
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/all', (req, res, next) => {
  SongRequest.remove({granted: null}).exec().then(() => {
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/:id', (req, res, next) => {
  SongRequest.findByIdAndRemove(req.params.id).exec().then(() => {
    res.sendStatus(200)
  }).catch(next)
})

router.use(middleware.role('admin'))

router.delete('/accepted/:id', (req, res) => {
  hub.emit('songRequests:delete', req.params.id)
  res.sendStatus(200)
})

router.delete('/tweet/:id', (req, res) => {
  hub.emit('tweetStream:delete', req.params.id)
  res.sendStatus(200)
})

module.exports = router
