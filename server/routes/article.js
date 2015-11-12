'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/:id', function(req, res) {
  db.Article.findById(req.params.id).populate({
    path: 'user',
    select: '-hash -email'
  }).exec(function(err, article) {
    db.ArticleComment.find({ article }).populate({
      path: 'user',
      select: '-hash -email'
    }).exec().then(function(comments) {
      res.send({ article, comments })
    })
  })
})

router.use(function(req, res, next) {
  if (req.user) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
})

router.post('/:id/comment', function(req, res) {
  const b = req.body
  const articleId = req.params.id
  new db.ArticleComment({
    text: b.comment,
    user: req.user._id,
    article: articleId
  }).save().then(function(comment) {
    res.send(comment)
  }, function() {
    res.sendStatus(500)
  })
})

module.exports = router