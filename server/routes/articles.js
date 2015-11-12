'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', function(req, res) {
  db.Article.find().populate({
    path: 'user',
    select: '-hash -email'
  }).exec().then(function(articles) {
    res.send(articles)
  })
})

router.use(function(req, res, next) {
  db.User.findById(req.session.uid).exec().then(function(user) {
    if (user && user.roles.writer) {
      next()
    } else {
      next(new Error('UNAUTHORISED'))
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
  }, function() {
    res.sendStatus(500)
  })
})

router.put('/:id', function(req, res) {
  const id = req.params.id
  const b = req.body
  db.Article.findByIdAndUpdate(id, {
    title: b.title,
    content: b.content
  }).exec().then(function() {
    res.sendStatus(200)
  }, function() {
    res.sendStatus(500)
  })
})

router.delete('/:id', function(req, res) {
  const id = req.params.id
  db.Article.findByIdAndRemove(id).exec().then(function() {
    res.sendStatus(200)
  }, function() {
    res.sendStatus(500)
  })
})

module.exports = router