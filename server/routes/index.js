'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io
const pictureRoutes = {}

router.use(function(req, res, next) {
  res.setHeader('Expires', '-1')
  res.setHeader('Cache-Control', 'must-revalidate, private')
  const uid = req.session.uid
  if (!uid) return next()
  db.User.findById(uid).select('-hash').lean().exec().then(function(user) {
    if (!user || (user && user.banned)) {
      // Disauth user
      throw new Error()
    }

    req.user = user
    next()
  }).catch(function(err) {
    req.session.uid = undefined
    next()
  })
}, function(req, res, next) {
  // console.log(req.ip, req.method, req.url, req.user ? req.user.username : '')
  next()
})

router.get('/picture/:id', function(req, res) {
  const id = req.params.id
  if (pictureRoutes[id]) {
    return res.redirect(pictureRoutes[id])
  }
  db.Picture.findById(id).exec().then(function(doc) {
    pictureRoutes[id] = '/i/' + doc._id + doc.extension
    res.redirect(pictureRoutes[id])
  }).catch(function() {
    res.sendStatus(404)
  })
})

router.use('/api/user', require('./user'))
router.use('/api/forgot', require('./forgot'))
router.use('/api/article', require('./article'))
router.use('/api/articles', require('./articles'))
router.use('/api/chat', require('./chat'))
router.use('/api/request', require('./request'))
router.use('/api/notification', require('./notification'))
router.use('/api/reservations', require('./reservations'))
router.use('/api/crew', require('./crew'))

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