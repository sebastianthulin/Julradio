'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const Notify = require('../services/Notify')
const getBlockage = require('../services/getBlockage')
const performAction = require('../services/performAction')

function parseType(type) {
  switch (type) {
    case 'article': return 'article'
    case 'user': return 'targetUser'
    case 'cosycorner': return 'cosyCorner'
  }
}

router.get('/replies/:id/:limit?', function(req, res, next) {
  const commentId = req.params.id
  const limit = req.params.limit || 9999
  db.Comment.findById(commentId).populate({
    path: 'user',
    select: '-hash -email',
  }).exec().then(function(comment) {
    db.Comment.find({
      replyTo: comment._id
    }).sort('-_id').limit(limit).populate({
      path: 'user',
      select: '-hash -email',
    }).exec().then(function(replies) {
      res.send({ comment, replies })
    })
  }).catch(next)
})

router.get('/:type', function(req, res, next) {
  const type = parseType(req.params.type)
  const target = req.query.target
  var comments

  if (!type) {
    return next(new Error('INVALID_COMMENT_TYPE'))
  }

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
  performAction(req.ip, 'comment').then(function() {
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
  }).catch(next)
})

router.post('/user', function(req, res, next) {
  const uid = req.user._id
  const target = req.body.target
  const text = req.body.text
  performAction(req.ip, 'comment').then(function() {
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
    }).then(function(comment) {
      if (uid != target) {
        Notify({
          userId: target,
          from: uid,
          type: 'wallPost'
        })
      }
      res.send(comment)
    }).catch(next)
  }).catch(next)
})

router.post('/cosycorner', function(req, res, next) {
  performAction(req.ip, 'comment').then(function() {
    new db.Comment({
      text: req.body.text,
      user: req.user._id,
      cosyCorner: true
    }).save()
      .then(res.send.bind(res))
      .catch(next)
  }).catch(next)
})

router.post('/reply', function(req, res, next) {
  const uid = req.user._id
  const b = req.body
  var comment
  performAction(req.ip, 'comment').then(function() {
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
      reply.article && db.Article.updateCommentCount(reply.article)
    }).catch(next)
  }).catch(next)
})

router.delete('/:id', function(req, res, next) {
  const commentId = req.params.id
  const uid = req.session.uid
  const isAdmin = req.user.roles.admin
  db.Comment.findById(commentId).exec().then(function(comment) {

    // se vad som händer ifall comment inte finns
    if (isAdmin || uid == comment.user || uid == comment.owner) {
      const promises = [comment.remove()]
      if (!comment.replyTo) {
        promises.push(db.Comment.find({
          replyTo: comment._id
        }).remove())
      }
      return Promise.all(promises)
    } else {
      throw new Error('UNAUTHORISED')
    }
  }).then(function(data) {
    const comment = data[0]
    res.sendStatus(200)
    comment.article && db.Article.updateCommentCount(comment.article)
    comment.replyTo && db.Comment.updateReplyCount(comment.replyTo)
  }).catch(next)
})

module.exports = router