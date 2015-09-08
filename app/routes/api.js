'use strict';

var express = require('express')
var router = express.Router()
var db = require('../models')
var cache = {}

router.get('/articles', function(req, res) {
  db.Article.find(function(err, docs) {
    res.send(docs)
  })
})

router.get('/article/create', function(req, res) {
  var article = db.Article()
  cache[article._id] = article
  res.send(article)
})

router.post('/article/:id', function(req, res) {
  var articleId = req.params.id
  var b = req.body
  if (cache[articleId]) {
    var article = cache[articleId]
    article.title = b.title
    article.text = b.text
    article.save(function(err) {
      res.send(!err)
    })
  } else {
    db.Article.findByIdAndUpdate(articleId, {
      title: b.title,
      text: b.text
    }, function(err) {
      res.send(!err)
    })
  }
})

router.delete('/article/:id', function(req, res) {
  db.Article.findByIdAndRemove(req.params.id, function(err) {
    res.send(!err)
  })
})

module.exports = router