'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', function(req, res) {
  db.Article.find().populate('user').lean().exec().then(function(articles) {
    res.send(articles)
  }, function(err) {
    console.log(err)
  })
})

router.use(function(req, res, next) {
  db.User.findById(req.session.uid).exec().then(function(user) {
    if (user && user.admin) {
      next()
    } else {
      res.sendStatus(404)
    }
  })
})

router.post('/', function(req, res) {
  const b = req.body
  new db.Article({
    title: b.title,
    content: b.content,
    user: req.session.uid || 1
  }).save().then(function(article) {
    res.send(article)
  }, function(err) {
    // ...
  })
})

router.put('/:id', function(req, res) {
  const id = req.params.id
  const b = req.body
  db.Article.findByIdAndUpdate(id, {
    title: b.title,
    content: b.content
  }).exec().then(function() {
    res.send(true)
  }, function(err) {
    res.send(false)
  })
})

router.delete('/:id', function(req, res) {
  const id = req.params.id
  db.Article.findByIdAndRemove(id).exec().then(function() {
    res.send(true)
  }, function(err) {
    // ...
  })
})

module.exports = router