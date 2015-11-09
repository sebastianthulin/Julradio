'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io

// new request
router.post('/', function(req, res) {
  new db.Request({
    name: req.body.name,
    song: req.body.song,
    text: req.body.text
  }).save().then(() => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(500)
  })
})

router.use(function(req, res, next) {
  if (req.user && req.user.roles.radioHost) {
    next()
  } else {
    res.sendStatus(500)
  }
})

router.get('/', function(req, res) {
  db.Request.find({granted: null}, function(err, docs) {
    res.send(docs)
  })
})

router.get('/granted', function(req, res) {
  db.Request.find({granted: true}).limit(100).exec(function(err, docs) {
    res.send(docs)
  })
})

// accept
router.put('/:id', function(req, res) {
  db.Request.findById(req.params.id, function(err, doc) {
    doc.granted = true
    doc.save(() => res.sendStatus(200))
  })
})

// deny
router.delete('/:id', function(req, res) {
  db.Request.remove({_id: req.params.id}, function(err, doc) {
    res.sendStatus(200)
  })
})

module.exports = router