'use strict'

const hub = require('clusterhub')
const {SongRequest} = require('../models')
const performAction = require('../services/performAction')

exports.create = (req, res, next) => {
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
}

exports.showUngranted = (req, res, next) => {
  SongRequest.find({granted: null})
    .then(res.send.bind(res))
    .catch(next)
}

exports.grant = (req, res, next) => {
  const id = req.params.id
  SongRequest.findById(id).then(request => {
    if (request && !request.granted) {
      request.granted = Date.now()
      return request.save()
    }
    throw new Error('SONG_REQUEST_INVALID')
  }).then(() => {
    hub.emit('songRequests:granted', id)
    res.sendStatus(200)
  }).catch(next)
}

exports.deny = (req, res, next) => {
  SongRequest.findByIdAndRemove(req.params.id).then(() => {
    res.sendStatus(200)
  }).catch(next)
}

exports.wipe = (req, res, next) => {
  SongRequest.remove({granted: null}).then(() => {
    res.sendStatus(200)
  }).catch(next)
}

exports.deleteRequest = (req, res) => {
  hub.emit('songRequests:delete', req.params.id)
  res.sendStatus(200)
}

exports.deleteTweet = (req, res) => {
  hub.emit('tweetStream:delete', req.params.id)
  res.sendStatus(200)
}
