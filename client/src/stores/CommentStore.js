const { EventEmitter } = require('events')
const { Promise } = require('es6-promise')
const request = require('../services/request')
const User = require('../services/User')
const UserStore = require('./UserStore')
const CommentStore = new EventEmitter

const commentsByTargetId = {}
const repliesByCommentId = {}

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
    .replace(new RegExp(matchesNotMe, 'ig'), '<a href="/@$1">@$1</a>')

  UserStore.insert(comment.user)
}

CommentStore.deleteComment = commentId => request.del('/api/comment/' + commentId)

CommentStore.post = function({ type, target }, text) {
  return new Promise(function(resolve, reject) {
    request.post('/api/comment/' + type, { target, text }).then(function({ body }) {
      resolve(body)
    }).catch(reject)
  })
}

CommentStore.reply = function(replyTo, text) {
  return new Promise(function(resolve, reject) {
    request.post('/api/comment/reply', { replyTo, text }).then(function({ body }) {
      console.log(body)
      resolve(body)
    }).catch(reject)
  })
}

CommentStore.fetch = function({ type, target }, handler) {
  handler(commentsByTargetId[target])
  request.get('/api/comment/' + type, { target }).then(function({ body: { comments, replies } }) {
    replies.forEach(function(replies) {
      if (replies.length > 0) {
        repliesByCommentId[replies[0].replyTo] = replies
      }
    })
    comments.forEach(transform)
    commentsByTargetId[target] = comments
    handler(comments)
  })
}

module.exports = CommentStore