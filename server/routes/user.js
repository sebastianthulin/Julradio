'use strict';

const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const db = require('../models')
const sha256 = str => crypto.createHash('sha256').update(str).digest('hex')

router.post('/signup', function(req, res) {
  const b = req.body
  new db.User({
    username: b.username,
    email: b.email,
    hash: sha256(b.password)
  }).save().then(function(model) {
    var user = model.toJSON()
    delete user.password
    req.session.uid = user.id
    res.send({user})
  }).catch(function(err) {
    console.log(err)
    res.send({err: err.toString()})
  })
})

router.post('/login', function(req, res) {
  const b = req.body
  new db.User({username: b.username}).fetch().then(function(model) {
    if (model) {
      const user = model.toJSON()
      if (user.hash === sha256(b.password)) {
        req.session.uid = user.id
        res.send({user})
      } else {
        res.send({err: 'INCORRECT_PASSWORD'})
      }
    } else {
      res.send({err: 'USER_NOT_FOUND'})
    }
  })
})

router.post('/logout', function(req, res) {
  req.session.uid = null
  res.end()
})

module.exports = router