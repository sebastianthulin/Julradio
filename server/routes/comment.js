'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const getBlockage = require('../services/getBlockage')

router.use(function(req, res, next) {
  if (req.user._id) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
})

router.delete('/:id', function(req, res, next) {
  const commentId = req.params.id
  const uid = req.session.uid
  const isAdmin = req.user.roles.admin
  db.Comment.findById(commentId).exec().then(function(comment) {
    // se vad som händer ifall comment inte finns
    if (isAdmin || uid == comment.user || uid == comment.owner) {
      return comment.remove()
    } else {
      throw new Error('UNAUTHORISED')
    }
  }).then(function(comment) {
    res.sendStatus(200)
    if (comment.article) {
      db.Article.updateCommentCount(comment.article)
    }
  }).catch(next)
})

router.post('/articlecomment', function(req, res) {
  const articleId = req.body.articleId
  const text = req.body.text
  console.log(articleId, text)
  db.Article.findById(articleId).then(function(article) {
    if (!article) throw ''
    return new db.Comment({
      text,
      user: req.user._id,
      owner: article.user,
      article: articleId
    }).save()
  }).then(function(comment) {
    res.send(comment)
    db.Article.updateCommentCount(articleId)
  }).catch(function() {
    res.sendStatus(500)
  })
})

router.post('/wallpost', function(req, res) {
  const uid = req.user._id
  const target = req.body.userId
  const text = req.body.text
  getBlockage(uid, target).then(function(relationship) {
    if (relationship) {
      throw new Error()
    }
    return new db.Comment({
      text,
      user: uid,
      owner: target,
      targetUser: target
    }).save()
  }).then(function(comment) {
    res.send(comment)
  }).catch(function(err) {
    res.sendStatus(500)
  })
})

module.exports = router