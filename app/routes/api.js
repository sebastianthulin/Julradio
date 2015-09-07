'use strict';

var express = require('express')
var router = express.Router()
var db = require('../models')

router.get('/articles', function(req, res) {
  db.Article.find(function(err, docs) {
    res.send(docs)
  })
})

module.exports = router