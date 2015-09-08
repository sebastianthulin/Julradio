'use strict';

var express = require('express')
var router = express.Router()
var io = require('../../server').io

var User = require('../models/User')

router.post('/reloadclients', function(req, res) {
  io.emit('reload')
  res.end()
})

router.post('/signup', function(req, res) {
  var user = User(req.body)

  user.save(function(err, user) {
    req.session.user = user
    res.send({user: user, err: err})
  })
})

router.post('/signin', function(req, res) {
  
})

router.get('*', function(req, res) {
  console.log(req.session.user)
  res.render('main')
})

module.exports = router