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

const populate = {
  path: 'user',
  select: '-hash -email',
}

const emptyCommentSection = {
  comments: [],
  replies: [],
  totalComments: 0
}

exports.show = async (req, res, next) => {
  try {
    const type = parseType(req.params.type)
    const {target = true} = req.query
    const skip = +req.query.skip || 0

    if (!type) {
      return next(new Error('INVALID_COMMENT_TYPE'))
    }

    const commentSection = await CommentSection.findOne({[type]: target})

    if (!commentSection) {
      return res.send(emptyCommentSection)
    }

    const {totalComments, totalThreads} = commentSection

    const comments = await Comment.find({
      commentSection: commentSection._id,
      replyTo: null
    }).sort('-_id').skip(skip).limit(20).populate(populate)

    const replies = await Promise.all(comments.map(c => Comment.find({
      replyTo: c._id
    }).sort('-_id').limit(3).populate(populate)))

    res.send({comments, replies, totalComments, totalThreads})
  } catch (err) {
    next(err)
  }
}

exports.showReplies = async (req, res, next) => {
  try {
    const replyTo = req.params.id
    const replies = await Comment.find({replyTo}).sort('-_id').populate(populate)
    res.send(replies)
  } catch (err) {
    next(err)
  }
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

exports.reply = async (req, res, next) => {
  try {
    const {text, replyTo} = req.body
    await performAction(req.ip, 'comment')
    const comment = await Comment.findById(replyTo)
    if (!comment) {
      throw new Error('NO_COMMENT')
    }
    if (comment.replyTo) {
      throw new Error('REPLY_TO_REPLY')
    }
    await Blockages.confirm(req.userId, comment.owner)
    const reply = await new Comment({
      text,
      user: req.userId,
      owner: comment.owner,
      replyTo: comment._id,
      commentSection: comment.commentSection
    }).save()
    updateCommentSection(comment.commentSection)
    res.send(reply)
    Comment.updateReplyCount(reply.replyTo)
    CommentSection.findById(comment.commentSection, (err, doc) => {
      doc.article && Article.updateCommentCount(doc.article)
      doc.updateCommentCount()
    })
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const commentId = req.params.id
    const isAdmin = req.user.roles.admin
    const comment = await Comment.findById(commentId)

    if (!comment) {
      throw new Error('NO_COMMENT')
    }

    if (isAdmin || req.userId == comment.user || req.userId == comment.owner) {
      const promises = [comment.remove()]
      if (!comment.replyTo) {
        promises.push(Comment.find({
          replyTo: comment._id
        }).remove())
      }
      await Promise.all(promises)
    } else {
      throw new Error('UNAUTHORISED')
    }
    res.sendStatus(200)
    CommentSection.findById(comment.commentSection, (err, doc) => {
      comment.replyTo && Comment.updateReplyCount(comment.replyTo)
      doc.article && Article.updateCommentCount(doc.article)
      doc.updateCommentCount()
    })
  } catch (err) {
    next(err)
  }
}
