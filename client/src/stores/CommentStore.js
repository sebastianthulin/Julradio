const { EventEmitter } = require('events')
const API = require('../services/API')
const parseComment = require('../services/parseComment')
const UserStore = require('./UserStore')
const CommentStore = new EventEmitter

const commentsByTargetId = {}
const repliesByCommentId = {}
const commentCountByTargetId = {}
const threadCountByTargetId = {}

function transform(comment) {
  comment.__html = parseComment(comment.text)
  UserStore.insert(comment.user)
}

function buildState(targetId) {
  if (!commentsByTargetId[targetId]) return {}
  const comments = commentsByTargetId[targetId].map(comment => ({
    comment,
    replies: repliesByCommentId[comment._id]
  }))
  return { comments, totalComments: commentCountByTargetId[targetId], totalThreads: threadCountByTargetId[targetId] }
}

CommentStore.deleteComment = (commentId, cb) => API.delete('/comment/' + commentId, cb)

CommentStore.fetchReplies = function(commentId, limit, cb) {
  API.get('/comment/replies/' + commentId + '/' + limit, function({ comment, replies }) {
    transform(comment)
    replies.forEach(transform)
    repliesByCommentId[comment._id] = replies.sort((a, b) => new Date(a.date) - new Date(b.date))
    cb({ comment, replies })
  })
}

CommentStore.post = function({ type, target }, text, cb) {
  API.post('/comment/' + type, { target, text }, cb)
}

CommentStore.reply = function(replyTo, text, cb) {
  API.post('/comment/reply', { replyTo, text }, cb)
}

CommentStore.fetch = function({ type, target, limit }, handler) {
  handler(buildState(target))
  API.get('/comment/' + type, { target, limit }, function({ comments, replies, totalComments, totalThreads }) {
    replies.forEach(function(replies) {
      if (replies.length > 0) {
        replies.forEach(transform)
        repliesByCommentId[replies[0].replyTo] = replies.sort((a, b) => new Date(a.date) - new Date(b.date))
      }
    })
    comments.forEach(transform)
    commentsByTargetId[target] = comments
    commentCountByTargetId[target] = totalComments
    threadCountByTargetId[target] = totalThreads
    handler(buildState(target))
  })
}

module.exports = CommentStore