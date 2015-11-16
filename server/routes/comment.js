'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const getBlockage = require('../services/getBlockage')

const types = {
  article: 'article',
  user: 'targetUser',
  cosycorner: 'cosyCorner'
}

router.get('/:type', function(req, res, next) {
  const type = types[req.params.type]
  const target = req.query.target
  if (!type) {
    return next(new Error('INVALID_COMMENT_TYPE'))
  }

  var comments

  db.Comment.find({
    [type]: target || true,
    replyTo: null
  }).sort('-_id').populate({
    path: 'user',
    select: '-hash -email',
  }).exec().then(function(docs) {
    comments = docs
    return Promise.all(comments.map(c => db.Comment.find({
      replyTo: c._id
    }).sort('-_id').limit(3).populate({
      path: 'user',
      select: '-hash -email',
    }).exec()))
  }).then(function(replies) {
    res.send({ comments, replies })
  }).catch(next)
})

router.use(function(req, res, next) {
  if (req.user._id) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
})

router.post('/article', function(req, res, next) {
  const articleId = req.body.target
  const text = req.body.text
  db.Article.findById(articleId).then(function(article) {
    if (!article) throw new Error('ARTICLE_NOT_FOUND')
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

router.post('/cosycorner', function(req, res, next) {
  new db.Comment({
    text: req.body.text,
    user: req.user._id,
    cosyCorner: true
  }).save()
    .then(res.send.bind(res))
    .catch(next)
})

router.post('/reply', function(req, res, next) {
  const uid = req.user._id
  const b = req.body
  var comment
  db.Comment.findById(b.replyTo).then(function(doc) {
    comment = doc
    if (!comment) {
      throw new Error('NO_COMMENT')
    }
    if (comment.replyTo) {
      throw new Error('REPLY_TO_REPLY')
    }
    return getBlockage(uid, comment.owner)
  }).then(function(relationship) {
    if (relationship) {
      throw new Error('BLOCKAGE')
    }
    return new db.Comment({
      text: b.text,
      user: uid,
      owner: comment.owner,
      replyTo: comment._id,
      cosyCorner: comment.cosyCorner,
      targetUser: comment.targetUser,
      article: comment.article
    }).save()
  }).then(function(reply) {
    res.send(reply)
    db.Comment.updateReplyCount(reply.replyTo)
  }).catch(next)
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

module.exports = router