'use strict';

const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/:username', function(req, res) {
  const username = req.params.username
  db.User.findOne({ username }).exec().then(function(user) {
    res.json(user)
  }, function(err) {
    // ...
  })
})

router.post('/signup', function(req, res) {
  new db.User().signUp(req.body).then(function(user) {
    delete user.hash
    req.session.uid = user.id
    res.send({ user })
  }, function(err) {
    console.log(err)
    res.send({err: err.toString()})
  })
})

router.post('/login', function(req, res) {
  const b = req.body
  db.User.findOne({username: b.username}).exec().then(function(user) {
    if (user) {
      if (user.auth(b.password)) {
        req.session.uid = user.id
        res.send({ user })
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