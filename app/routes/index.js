'use strict';

var express = require('express')
var router = express.Router()
var io = require('../../server').io
var db = require('../models')

router.post('/reloadclients', function(req, res) {
  io.emit('reload')
  res.end()
})

router.post('/signup', function(req, res) {
  db.User().signUp(req.body, function(err, user) {
    req.session.uid = user._id
    res.send({err, user})
  })
})

router.post('/login', function(req, res) {
  var b = req.body
  db.User.findOne({username: b.username}, function(err, user) {
    if (user) {
      if (user.auth(b.password)) {
        req.session.uid = user._id
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

router.use(function(req, res, next) {
  if (!req.session.uid) return next()

  db.User
    .findById(req.session.uid)
    .select('-password')
    .exec(function(err, user) {
      req.user = user
      next()
    })
})

router.get('*', function(req, res) {
  res.render('main', {
    user: req.user
  })
})

module.exports = router