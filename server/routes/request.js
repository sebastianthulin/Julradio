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

// deny
router.delete('/:id', function(req, res) {

})

// accept
router.put('/:id', function(req, res) {

})

router.use(function(req, res, next) {
  if (req.user && req.user.admin) {
    next()
  } else {
    res.sendStatus(500)
  }
})

router.get('/', function(req, res) {
  db.Request.find(function(err, docs) {
    res.send(docs)
  })
})

module.exports = router