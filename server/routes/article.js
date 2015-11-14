'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/:id', function(req, res) {
  db.Article.findById(req.params.id).populate({
    path: 'user',
    select: '-hash -email'
  }).exec(function(err, article) {
    db.Comment.find({ article: article._id }).populate({
      path: 'user',
      select: '-hash -email'
    }).exec().then(function(comments) {
      res.send({ article, comments })
    })
  })
})

module.exports = router