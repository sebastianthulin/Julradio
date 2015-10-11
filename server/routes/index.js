'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io

router.use('/api/user', require('./user'))
router.use('/api/articles', require('./articles'))
router.use('/api/chat', require('./chat'))

router.post('/reloadclients', function(req, res) {
  io.emit('reload')
  res.end()
})

router.use(function(req, res, next) {
  console.log(req.ip, req.url)
  const uid = req.session.uid
  if (!uid) return next()
  db.User.findById(uid).select('-hash').exec().then(function(user) {
    req.user = user
    next()
  }, function(err) {
    req.session.uid = undefined
    next()
  })
})

router.get('*', function(req, res) {
  res.render('main', {
    user: req.user
  })
})

module.exports = router