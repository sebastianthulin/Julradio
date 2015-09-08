'use strict';

var express = require('express')
var router = express.Router()
var db = require('../models')

router.get('/articles', function(req, res) {
  db.Article.find(function(err, docs) {
    res.send(docs)
  })
})

router.post('/article/create', function(req, res) {

})

router.post('/article/:id', function(req, res) {
  var article = req.body
  db.Article.findByIdAndUpdate(article._id, {
    title: article.title,
    text: article.text
  }).exec(function(err) {
    res.send(!err)
  })
})

router.delete('/article/:id', function(req, res) {

  console.log('lol')
  console.log(req.params.id)
})

module.exports = router