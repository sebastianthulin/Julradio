const { EventEmitter } = require('events')
const { Promise } = require('es6-promise')
const request = require('../services/request')
const CommentStore = new EventEmitter

const commentsByTargetId = {}

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
    commentsByTargetId[target] = body
    handler(body)
  })
}

module.exports = CommentStore