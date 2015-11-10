const { EventEmitter } = require('events')
const marked = require('marked')
const request = require('../services/request')
const ArticleStore = new EventEmitter

var articles = []
var articleById = {}

ArticleStore.create = function(opts, callback) {
  request.post('/api/articles', opts).then(function({ body }) {
    ArticleStore.get()
    callback(body)
  })
}

ArticleStore.update = function(id, opts) {
  request.put('/api/articles/' + id, opts).then(ArticleStore.get)
}

ArticleStore.delete = function(id) {
  request.del('/api/articles/' + id).then(ArticleStore.get)
}

ArticleStore.get = function(callback) {
  typeof callback === 'function' && callback(articles)
  request.get('/api/articles').then(function({ body }) {
    articles = body
    articles.forEach(article => {
      article.date = new Date(article.date)
      article.__html = marked(article.content)
      articleById[article._id] = article
    })
    articles.sort((a, b) => b.date - a.date)
    typeof callback === 'function' && callback(articles)
    ArticleStore.emit('articles', articles)
  })
}

ArticleStore.getOne = function(id, callback) {
  if (articleById[id]) {
    callback({article: articleById[id]})
  }
  request.get('/api/article/' + id).then(function({ body }) {
    body.article.__html = marked(body.article.content)
    callback(body)
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