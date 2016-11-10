'use strict'

const {CommentSection, Comment, Article} = require('../models')
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
  CommentSection.findById(commentSection).then(doc => {
    doc.updateCommentCount()
  })
}

const getSection = query => {
  return CommentSection.findOne(query).exec().then(doc => {
    return doc ? doc : new CommentSection(query).save()
  })
}

exports.show = (req, res, next) => {
  const type = parseType(req.params.type)
  const target = req.query.target
  const limit = +req.query.limit || 20
  let comments
  let totalComments, totalThreads

  if (!type) {
    return next(new Error('INVALID_COMMENT_TYPE'))
  }

  CommentSection.findOne({
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
    return Comment.find({
      commentSection: commentSection._id,
      replyTo: null
    }).sort('-_id').limit(limit).populate({
      path: 'user',
      select: '-hash -email',
    }).exec().then(docs => {
      comments = docs
      return Promise.all(comments.map(c => Comment.find({
        replyTo: c._id
      }).sort('-_id').limit(3).populate({
        path: 'user',
        select: '-hash -email',
      }).exec()))
    }).then(replies => {
      res.send({comments, replies, totalComments, totalThreads})
    }).catch(next)
  })
}

exports.showReplies = (req, res, next) => {
  const commentId = req.params.id
  const limit = req.params.limit || 9999
  Comment.findById(commentId).populate({
    path: 'user',
    select: '-hash -email',
  }).exec().then(comment => {
    Comment.find({
      replyTo: comment._id
    }).sort('-_id').limit(limit).populate({
      path: 'user',
      select: '-hash -email',
    }).exec().then(replies => {
      res.send({comment, replies})
    })
  }).catch(next)
}

exports.createOnArticle = (req, res, next) => {
  const text = req.body.text
  const articleId = req.body.target
  let article
  Article.findById(articleId).exec().then(doc => {
    if (!doc) throw new Error('ARTICLE_NOT_FOUND')
    article = doc
    return performAction(req.ip, 'comment')
  }).then(() => {
    return getSection({article: articleId})
  }).then(commentSection => {
    return new Comment({
      text,
      user: req.userId,
      owner: article.user,
      commentSection: commentSection._id
    }).save()
  }).then(comment => {
    res.send(comment)
    Article.updateCommentCount(articleId)
    updateCommentSection(comment.commentSection)
  }).catch(next)
}

exports.createOnUser = (req, res, next) => {
  const target = req.body.target
  const text = req.body.text
  return Promise.all([
    getSection({user: target}),
    performAction(req.ip, 'comment'),
    Blockages.confirm(req.userId, target)
  ]).then(data => {
    return new Comment({
      text,
      user: req.userId,
      owner: target,
      commentSection: data[0]._id
    }).save()
  }).then(comment => {
    if (req.userId != target) {
      Notify({
        userId: target,
        from: req.userId,
        type: 'wallPost'
      })
    }
    res.send(comment)
    updateCommentSection(comment.commentSection)
  }).catch(next)
}

exports.createOnCosycorner = (req, res, next) => {
  performAction(req.ip, 'comment').then(() => {
    return getSection({cosyCorner: true})
  }).then(commentSection => {
    return new Comment({
      text: req.body.text,
      user: req.userId,
      commentSection: commentSection._id
    }).save()
  }).then(comment => {
    res.send(comment)
    updateCommentSection(comment.commentSection)
  }).catch(next)
}

exports.reply = (req, res, next) => {
  const b = req.body
  let comment
  performAction(req.ip, 'comment').then(() => {
    return Comment.findById(b.replyTo).exec()
  }).then(doc => {
    comment = doc
    if (!comment) {
      throw new Error('NO_COMMENT')
    }
    if (comment.replyTo) {
      throw new Error('REPLY_TO_REPLY')
    }
    return Blockages.confirm(req.userId, comment.owner)
  }).then(() => {
    return new Comment({
      text: b.text,
      user: req.userId,
      owner: comment.owner,
      replyTo: comment._id,
      commentSection: comment.commentSection
    }).save()
    updateCommentSection(comment.commentSection)
  }).then(reply => {
    res.send(reply)
    Comment.updateReplyCount(reply.replyTo)
    CommentSection.findById(comment.commentSection, (err, doc) => {
      doc.article && Article.updateCommentCount(doc.article)
      doc.updateCommentCount()
    })
  }).catch(next)
}

exports.delete = (req, res, next) => {
  const commentId = req.params.id
  const isAdmin = req.user.roles.admin
  Comment.findById(commentId).exec().then(comment => {

    // se vad som händer ifall comment inte finns
    if (isAdmin || req.userId == comment.user || req.userId == comment.owner) {
      const promises = [comment.remove()]
      if (!comment.replyTo) {
        promises.push(Comment.find({
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
    CommentSection.findById(comment.commentSection, (err, doc) => {
      doc.article && Article.updateCommentCount(doc.article)
      doc.replyTo && Comment.updateReplyCount(doc.replyTo)
      doc.updateCommentCount()
    })
  }).catch(next)
}
