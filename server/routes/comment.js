'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../models')
const Notify = require('../services/Notify')
const Blockages = require('../services/Blockages')
const performAction = require('../services/performAction')

const parseType = type => {
  switch (type) {
    case 'article': return 'article'
    case 'user': return 'user'
    case 'cosycorner': return 'cosyCorner'
  }
}

const updateCommentSection = commentSection => {
  db.CommentSection.findById(commentSection).then(doc => {
    doc.updateCommentCount()
  })
}

const getSection = query => {
  return db.CommentSection.findOne(query).exec().then(doc => {
    return doc ? doc : new db.CommentSection(query).save()
  })
}

router.use(middleware.body)

router.get('/replies/:id/:limit?', (req, res, next) => {
  const commentId = req.params.id
  const limit = req.params.limit || 9999
  db.Comment.findById(commentId).populate({
    path: 'user',
    select: '-hash -email',
  }).exec().then(comment => {
    db.Comment.find({
      replyTo: comment._id
    }).sort('-_id').limit(limit).populate({
      path: 'user',
      select: '-hash -email',
    }).exec().then(replies => {
      res.send({comment, replies})
    })
  }).catch(next)
})

router.get('/:type', (req, res, next) => {
  const type = parseType(req.params.type)
  const target = req.query.target
  const limit = +req.query.limit || 20
  let comments
  let totalComments, totalThreads

  if (!type) {
    return next(new Error('INVALID_COMMENT_TYPE'))
  }

  db.CommentSection.findOne({
    [type]: target || true,
  }).exec().then(commentSection => {
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
    }).exec().then(docs => {
      comments = docs
      return Promise.all(comments.map(c => db.Comment.find({
        replyTo: c._id
      }).sort('-_id').limit(3).populate({
        path: 'user',
        select: '-hash -email',
      }).exec()))
    }).then(replies => {
      res.send({comments, replies, totalComments, totalThreads})
    }).catch(next)
  })
})

router.use(middleware.signedIn)

router.post('/article', (req, res, next) => {
  const text = req.body.text
  const articleId = req.body.target
  let article
  db.Article.findById(articleId).exec().then(doc => {
    if (!doc) throw new Error('ARTICLE_NOT_FOUND')
    article = doc
    return performAction(req.ip, 'comment')
  }).then(() => {
    return getSection({article: articleId})
  }).then(commentSection => {
    return new db.Comment({
      text,
      user: req.userId,
      owner: article.user,
      commentSection: commentSection._id
    }).save()
  }).then(comment => {
    res.send(comment)
    db.Article.updateCommentCount(articleId)
    updateCommentSection(comment.commentSection)
  }).catch(next)
})

router.post('/user', (req, res, next) => {
  const uid = req.userId
  const target = req.body.target
  const text = req.body.text
  return Promise.all([
    getSection({user: target}),
    performAction(req.ip, 'comment'),
    Blockages.confirm(uid, target)
  ]).then(data => {
    return new db.Comment({
      text,
      user: uid,
      owner: target,
      commentSection: data[0]._id
    }).save()
  }).then(comment => {
    if (uid != target) {
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

router.post('/cosycorner', (req, res, next) => {
  performAction(req.ip, 'comment').then(() => {
    return getSection({cosyCorner: true})
  }).then(commentSection => {
    return new db.Comment({
      text: req.body.text,
      user: req.userId,
      commentSection: commentSection._id
    }).save()
  }).then(comment => {
    res.send(comment)
    updateCommentSection(comment.commentSection)
  }).catch(next)
})

router.post('/reply', (req, res, next) => {
  const uid = req.userId
  const b = req.body
  let comment
  performAction(req.ip, 'comment').then(() => {
    return db.Comment.findById(b.replyTo).exec()
  }).then(doc => {
    comment = doc
    if (!comment) {
      throw new Error('NO_COMMENT')
    }
    if (comment.replyTo) {
      throw new Error('REPLY_TO_REPLY')
    }
    return Blockages.confirm(uid, comment.owner)
  }).then(() => {
    return new db.Comment({
      text: b.text,
      user: uid,
      owner: comment.owner,
      replyTo: comment._id,
      commentSection: comment.commentSection
    }).save()
    updateCommentSection(comment.commentSection)
  }).then(reply => {
    res.send(reply)
    db.Comment.updateReplyCount(reply.replyTo)
    db.CommentSection.findById(comment.commentSection, (err, doc) => {
      doc.article && db.Article.updateCommentCount(doc.article)
      doc.updateCommentCount()
    })
  }).catch(next)
})

router.delete('/:id', (req, res, next) => {
  const commentId = req.params.id
  const uid = req.userId
  const isAdmin = req.user.roles.admin
  db.Comment.findById(commentId).exec().then(comment => {

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
  }).then(data => {
    const comment = data[0]
    res.sendStatus(200)
    db.CommentSection.findById(comment.commentSection, (err, doc) => {
      doc.article && db.Article.updateCommentCount(doc.article)
      doc.replyTo && db.Comment.updateReplyCount(doc.replyTo)
      doc.updateCommentCount()
    })
  }).catch(next)
})

module.exports = router
