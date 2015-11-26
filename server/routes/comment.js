'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const Notify = require('../services/Notify')
const Blockages = require('../services/Blockages')
const performAction = require('../services/performAction')

function parseType(type) {
  switch (type) {
    case 'article': return 'article'
    case 'user': return 'user'
    case 'cosycorner': return 'cosyCorner'
  }
}

function updateCommentSection(commentSection) {
  db.CommentSection.findById(commentSection).then(function(doc) {
    doc.updateCommentCount()
  })
}

function getSection(query) {
  return db.CommentSection.findOne(query).exec().then(function(doc) {
    return doc ? doc : new db.CommentSection(query).save()
  })
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
  const limit = req.query.limit || 20
  var comments
  var totalComments, totalThreads

  if (!type) {
    return next(new Error('INVALID_COMMENT_TYPE'))
  }

  db.CommentSection.findOne({
    [type]: target || true,
  }).exec().then(function(commentSection) {
    if (!commentSection) {
      return res.send({
        comments: [],
        replies: [],
        totalComments: 0
      })
    }
    totalComments = commentSection.totalComments
    totalThreads = commentSection.totalThreads
    return db.Comment.find({
      commentSection: commentSection._id,
      replyTo: null
    }).sort('-_id').limit(limit).populate({
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
      res.send({ comments, replies, totalComments, totalThreads })
    }).catch(next)
  })
})

router.use(function(req, res, next) {
  if (req.user) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
})

router.post('/article', function(req, res, next) {
  const text = req.body.text
  const articleId = req.body.target
  var article
  db.Article.findById(articleId).exec().then(function(doc) {
    if (!doc) throw new Error('ARTICLE_NOT_FOUND')
    article = doc
    return performAction(req.ip, 'comment')
  }).then(function() {
    return getSection({article: articleId})
  }).then(function(commentSection) {
    return new db.Comment({
      text,
      user: req.user._id,
      owner: article.user,
      commentSection: commentSection._id
    }).save()
  }).then(function(comment) {
    res.send(comment)
    db.Article.updateCommentCount(articleId)
    updateCommentSection(comment.commentSection)
  }).catch(next)
})

router.post('/user', function(req, res, next) {   // to b fix
  const uid = req.user._id
  const target = req.body.target
  const text = req.body.text
  return Promise.all([
    getSection({user: target}),
    performAction(req.ip, 'comment'),
    Blockages.confirm(uid, target)
  ]).then(function(data) {
    return new db.Comment({
      text,
      user: uid,
      owner: target,
      commentSection: data[0]._id
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
    updateCommentSection(comment.commentSection)
  }).catch(next)
})

router.post('/cosycorner', function(req, res, next) {
  performAction(req.ip, 'comment').then(function() {
    return getSection({cosyCorner: true})
  }).then(function(commentSection) {
    return new db.Comment({
      text: req.body.text,
      user: req.user._id,
      commentSection: commentSection._id
    }).save()
  }).then(function(comment) {
    res.send(comment)
    updateCommentSection(comment.commentSection)
  }).catch(next)
})

router.post('/reply', function(req, res, next) {
  const uid = req.user._id
  const b = req.body
  var comment
  performAction(req.ip, 'comment').then(function() {
    return db.Comment.findById(b.replyTo).exec()
  }).then(function(doc) {
    comment = doc
    if (!comment) {
      throw new Error('NO_COMMENT')
    }
    if (comment.replyTo) {
      throw new Error('REPLY_TO_REPLY')
    }
    return Blockages.confirm(uid, comment.owner)
  }).then(function() {
    return new db.Comment({
      text: b.text,
      user: uid,
      owner: comment.owner,
      replyTo: comment._id,
      commentSection: comment.commentSection
    }).save()
    updateCommentSection(comment.commentSection)
  }).then(function(reply) {
    res.send(reply)
    db.Comment.updateReplyCount(reply.replyTo)
    db.CommentSection.findById(comment.commentSection, function(err, doc) {
      doc.article && db.Article.updateCommentCount(doc.article)
      doc.updateCommentCount()
    })
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
    db.CommentSection.findById(comment.commentSection, function(err, doc) {
      doc.article && db.Article.updateCommentCount(doc.article)
      doc.replyTo && db.Comment.updateReplyCount(doc.replyTo)
      doc.updateCommentCount()
    })
  }).catch(next)
})

module.exports = router