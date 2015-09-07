'use strict';

var express = require('express')
var router = express.Router()
var io = require('../../server').io

router.post('/reloadclients', function(req, res) {
  io.emit('reload')
  res.end()
})

router.get('*', function(req, res) {
  res.render('main')
})

module.exports = router