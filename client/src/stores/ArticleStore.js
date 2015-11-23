const { EventEmitter } = require('events')
const marked = require('marked')
const request = require('../services/request')
const UserStore = require('./UserStore')
const ArticleStore = new EventEmitter

var articles = []
var articleById = {}

ArticleStore.transform = function(article) {
  if (article.user) {
    UserStore.insert(article.user)
  } else {
    article.userless = true
  }
  article.date = new Date(article.date)
  article.__html = marked(article.content)
  articleById[article._id] = article
}

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

ArticleStore.get = function(callback, archive) {
  typeof callback === 'function' && callback(articles)
  request.get('/api/articles' + (archive ? '/archive' : '')).then(function({ body }) {
    articles = body
    articles.forEach(ArticleStore.transform)
    articles.sort((a, b) => b.date - a.date)
    typeof callback === 'function' && callback(articles)
    ArticleStore.emit('articles', articles)
  })
}

ArticleStore.getById = function(id, callback) {
  if (articleById[id]) {
    callback(articleById[id])
  }
  request.get('/api/articles/' + id).then(function({ body: article }) {
    ArticleStore.transform(article)
    callback(article)
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