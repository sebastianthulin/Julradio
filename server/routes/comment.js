'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const getBlockage = require('../services/getBlockage')

const types = {
  article: 'article',
  user: 'targetUser'
}

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

router.get('/:type', function(req, res, next) {
  const type = types[req.params.type]
  const target = req.query.target
  if (!type) {
    return next(new Error('INVALID_COMMENT_TYPE'))
  }

  db.Comment.find({
    [type]: target
  }).sort('-_id').populate({
    path: 'user',
    select: '-hash -email'
  }).exec().then(function(comments) {
    res.send(comments)
  }).catch(next)
})

router.post('/article', function(req, res, next) {
  const articleId = req.body.target
  const text = req.body.text
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
  }).catch(next)
})

router.post('/user', function(req, res, next) {
  const uid = req.user._id
  const target = req.body.target
  const text = req.body.text
  getBlockage(uid, target).then(function(relationship) {
    if (relationship) {
      throw new Error('BLOCKAGE')
    }
    return new db.Comment({
      text,
      user: uid,
      owner: target,
      targetUser: target
    }).save()
  }).then(res.send.bind(res)).catch(next)
})

router.post('/reply', function(req, res, next) {
  const uid = req.user._id
  const b = req.body
  db.Comment.findById(b.replyTo).then(function(comment) {
    if (!comment) {
      throw new Error('NO_COMMENT')
    }
    if (comment.replyTo !== null) {
      throw new Error('REPLY_TO_REPLY')
    }
    getBlockage(uid, comment.owner).then(function(relationship) {
      if (relationship) {
        throw new Error('BLOCKAGE')
      }
      return new db.Comment({
        text: b.text,
        user: uid,
        owner: comment.owner,
        replyTo: comment._id,
        targetUser: comment.targetUser,
        article: comment.article
      }).save()
    })
  }).then(function(comment) {
    res.send(comment)
  })
})

module.exports = router