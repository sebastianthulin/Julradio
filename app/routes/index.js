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
  var user = db.User(req.body)

  user.save(function(err, user) {
    req.session.user = user
    res.send({err, user})
  })
})

router.post('/signin', function(req, res) {
  
})

router.get('*', function(req, res) {
  res.render('main')
})

module.exports = router