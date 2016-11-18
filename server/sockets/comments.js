'use strict'

const {io} = require('../server')
const {CommentSection, Comment, Article} = require('../models')
const {apiError} = require('../utils/apiError')
const {performAction, notify, blockages} = require('../utils/userUtils')
const {SAFE_USER_SELECT} = require('../constants')

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

const populate = {path: 'user', select: SAFE_USER_SELECT}

const emptyCommentSection = {
  comments: [],
  replies: [],
  totalComments: 0
}

const fetchComments = async (type, target, skip) => {
  const commentSection = await CommentSection.findOne({[type]: target})

  if (!commentSection) {
    return emptyCommentSection
  }

  const {totalComments, totalThreads} = commentSection

  const comments = await Comment.find({
    commentSection: commentSection._id,
    replyTo: null
  }).sort('-_id').skip(skip).limit(20).populate(populate)

  const replies = await Promise.all(comments.map(c => Comment.find({
    replyTo: c._id
  }).sort('-_id').limit(3).populate(populate)))

  return {comments, replies, totalComments, totalThreads}
}

const fetchReplies = async replyTo => {
  const replies = await Comment.find({replyTo}).sort('-_id').populate(populate)
  return replies
}

const createComment = async ({ip, userId}, {text, query, owner}) => {
  const [commentSection] = await Promise.all([
    getSection(query),
    performAction(ip, 'comment')
  ])
  const comment = {
    text: text.trim(),
    user: userId,
    owner,
    commentSection: commentSection._id
  }
  const doc = await new Comment(comment).save()
  comment._id = doc._id.toString()
  comment.date = doc.date
  updateCommentSection(commentSection._id)
  return comment
}

const commentOnArticle = async (socket, text, articleId) => {
  const article = await Article.findById(articleId)
  if (!article) {
    throw apiError('ARTICLE_NOT_FOUND')
  }
  const query = {article: articleId}
  const comment = await createComment(socket, {text, query, owner: article.user})
  Article.updateCommentCount(articleId)
  return comment
}

const commentOnUser = async (socket, text, targetUserId) => {
  await blockages.confirm(socket.userId, targetUserId)
  const query = {user: targetUserId}
  const comment = await createComment(socket, {text, query, owner: targetUserId})
  if (socket.userId !== targetUserId) {
    notify({userId: targetUserId, from: socket.userId, type: 'wallPost'})
  }
  return comment
}

const commentOnCosycorner = async (socket, text) => {
  const query = {cosyCorner: true}
  const comment = await createComment(socket, {text, query})
  return comment
}

const createReply = async (socket, text, replyTo) => {
  const comment = await Comment.findById(replyTo)
  if (!comment || comment.replyTo) {
    throw apiError('NO_COMMENT')
  }
  await Promise.all([
    performAction(socket.ip, 'comment'),
    blockages.confirm(socket.userId, comment.owner)
  ])
  const reply = {
    text,
    user: socket.userId,
    owner: comment.owner,
    replyTo: comment._id,
    commentSection: comment.commentSection
  }
  const doc = await new Comment(reply).save()
  reply._id = doc._id.toString()
  reply.date = doc.date
  updateCommentSection(comment.commentSection)
  Comment.updateReplyCount(reply.replyTo)
  CommentSection.findById(comment.commentSection, (err, doc) => {
    doc.article && Article.updateCommentCount(doc.article)
    doc.updateCommentCount()
  })
  return reply
}

const deleteComment = async (socket, commentId) => {
  const comment = await Comment.findById(commentId)
  if (!comment) {
    throw apiError('NO_COMMENT')
  }
  if (!(socket.isAdmin || socket.userId == comment.user || socket.userId == comment.owner)) {
    throw apiError('UNAUTHORISED')
  }
  const promises = [comment.remove()]
  if (!comment.replyTo) {
    promises.push(Comment.find({replyTo: comment._id}).remove())
  }
  await Promise.all(promises)
  CommentSection.findById(comment.commentSection, (err, doc) => {
    comment.replyTo && Comment.updateReplyCount(comment.replyTo)
    doc.article && Article.updateCommentCount(doc.article)
    doc.updateCommentCount()
  })
}

const socketHandler = socket => {
  let subscription

  const subscribe = target => {
    if (target !== subscription) {
      socket.leave(subscription)
      subscription = target
      socket.join('comments:' + target)
    }
  }

  const unsubscribe = target => {
    if (target === subscription) {
      subscription = undefined
    }
    socket.leave('comments:' + target)
  }

  const createByType = {
    article: commentOnArticle,
    user: commentOnUser,
    cosyCorner: commentOnCosycorner
  }

  if (socket.userId) {
    socket.on('comments:create', async ({text, type, target}, success) => {
      const createComment = createByType[type]
      const comment = await createComment(socket, text, target)
      comment.user = socket.user
      io.to('comments:' + target).emit('comment', {target, comment})
      success()
    })

    socket.on('comments:createReply', async ({text, replyTo, target}, success) => {
      const reply = await createReply(socket, text, replyTo)
      reply.user = socket.user
      io.to('comments:' + target).emit('reply', {target, reply})
      success()
    })

    socket.on('comments:deleteComment', async (commentId, success) => {
      await deleteComment(socket, commentId)
      success()
    })
  }

  socket.on('comments:fetch', async ({type, target, skip}, respond) => {
    subscribe(target)
    const isValidType = ['article', 'user', 'cosyCorner'].indexOf(type) > -1
    if (isValidType && target) {
      respond(await(fetchComments(type, target, skip)))
    }
  })

  socket.on('comments:fetchReplies', async (commentId, respond) => {
    respond(await(fetchReplies(commentId)))
  })

  socket.on('comments:unsubscribe', unsubscribe)  // not added on the client yet
}

module.exports = socketHandler
