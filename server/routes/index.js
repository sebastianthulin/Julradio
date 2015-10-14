'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io

router.use(function(req, res, next) {
  const uid = req.session.uid
  if (!uid) return next()
  db.User.findById(uid).select('-hash').populate('picture').exec().then(function(user) {
    req.user = user
    next()
  }, function(err) {
    req.session.uid = undefined
    next()
  })
}, function(req, res, next) {
  console.log(req.ip, req.method, req.url, req.user ? req.user.username : '')
  next()
})

router.use('/api/user', require('./user'))
router.use('/api/articles', require('./articles'))
router.use('/api/chat', require('./chat'))
router.use('/api', require('./misq'))

router.post('/reloadclients', function(req, res) {
  io.emit('reload')
  res.end()
})

router.get('*', function(req, res) {
  res.render('main', {
    user: req.user
  })
})

module.exports = router