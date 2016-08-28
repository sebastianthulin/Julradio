'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../models')

router.use(middleware.signedIn)
router.use(middleware.body)

router.get('/', (req, res) => {
  db.Notification.find({to: req.userId}).exec().then(docs => {
    res.send(docs || [])
  })
})

router.post('/', (req, res) => {
  const b = req.body
  db.Notification.findOneAndRemove({
    to: req.userId,
    type: b.type,
    value: b.value
  }).exec().then(() => {
    res.sendStatus(200)
  }).catch(() => {
    console.log(arguments)
    res.sendStatus(500)
  })
})

module.exports = router
