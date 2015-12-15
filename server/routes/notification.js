'use strict';

const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../models')

router.use(middleware.signedIn)
router.use(middleware.body)

router.get('/', function(req, res) {
  db.Notification.find({to: req.userId}).exec().then(function(docs) {
    res.send(docs || [])
  })
})

router.post('/', function(req, res) {
  const b = req.body
  db.Notification.findOneAndRemove({
    to: req.userId,
    type: b.type,
    value: b.value
  }).exec().then(function() {
    res.sendStatus(200)
  }).catch(function() {
    console.log(arguments)
    res.sendStatus(500)
  })
})

module.exports = router