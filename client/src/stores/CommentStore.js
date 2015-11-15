const { EventEmitter } = require('events')
const { Promise } = require('es6-promise')
const request = require('../services/request')
const User = require('../services/User')
const CommentStore = new EventEmitter

const commentsByTargetId = {}

function transform(comment) {
  const username = (User.get() || {}).username
  const reg = new RegExp(`@(${username})(?!\w+)`, 'ig')
  const markup = comment.text
    .replace(reg, '<a href="/@$1" class="highlight">@$1</a>')
    .replace(/\n/g, '<br />')
  comment.__html = markup
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
      resolve(body)
    }).catch(reject)
  })
}

CommentStore.fetch = function({ type, target }, handler) {
  handler(commentsByTargetId[target])
  request.get('/api/comment/' + type, { target }).then(function({ body }) {
    body.forEach(transform)
    commentsByTargetId[target] = body
    handler(body)
  })
}

module.exports = CommentStore