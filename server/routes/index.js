'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const io = require('../../server').io

router.use('/user', require('./user'))
router.use('/articles', require('./articles'))

router.post('/reloadclients', function(req, res) {
  io.emit('reload')
  res.end()
})

router.use(function(req, res, next) {
  const uid = req.session.uid
  if (!uid) return next()
  new db.User({id: uid}).fetch().then(function(model) {
    if (model) {
      req.user = model.toJSON()
    }
    next()
  })
})

router.get('*', function(req, res) {
  res.render('main', {
    user: req.user
  })
})

module.exports = router