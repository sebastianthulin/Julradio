const { EventEmitter } = require('events')
const request = require('superagent')
const marked = require('marked')
const socket = require('../services/socket')
const ArticleStore = new EventEmitter
var articles = []

ArticleStore.create = function(opts, callback) {
  request.post('/api/articles', opts, function(err, res) {
    ArticleStore.get()
    callback(res.body)
  })
}

ArticleStore.update = function(id, opts) {
  request.put('/api/articles/' + id, opts, () => ArticleStore.get())
}

ArticleStore.delete = function(id) {
  request.del('/api/articles/' + id, () => ArticleStore.get())
}

ArticleStore.get = function(callback) {
  callback && callback(articles)
  request.get('/api/articles', function(err, { body }) {
    articles = body
    articles.sort((a, b) => new Date(b.date) - new Date(a.date))
    articles.forEach(article => article.marked = marked(article.content))
    callback && callback(articles)
    ArticleStore.emit('articles', articles)
  })
}

ArticleStore.subscribe = function(handler) {
  handler(articles)
  ArticleStore.on('articles', handler)
  ArticleStore.get()
  return function unsubscribe() {
    ArticleStore.removeListener('articles', handler)
  }
}

module.exports = ArticleStore