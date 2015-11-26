const { EventEmitter } = require('events')
const API = require('../services/API')
const User = require('../services/User')
const UserStore = require('./UserStore')
const CommentStore = new EventEmitter

const commentsByTargetId = {}
const repliesByCommentId = {}
const commentCountByTargetId = {}
const threadCountByTargetId = {}

function transform(comment) {
  const username = (User.get() || {}).username
  var markup = comment.text, matchesNotMe

  if (username) {
    // user signed in, match all mentions except for @${username}
    const matchesMe = `@(${username})(?!\\\w+)`
    matchesNotMe = `@((?!${username}(?!\\\w+))\\\w+)`
    markup = markup.replace(new RegExp(matchesMe, 'ig'), '<a href="/@$1" class="highlight">@$1</a>')
  } else {
    // user not signed in, match all mentions
    matchesNotMe = `@(\\\w+)(?!\\\w+)`
  }
  
  comment.__html = markup
    .replace(/\n/g, '<br />')
    .replace(/:tomten:/g, '<img alt=":tomten:" src="/images/user-3.png" height="16" />')
    .replace(new RegExp(matchesNotMe, 'ig'), '<a href="/@$1">@$1</a>')

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