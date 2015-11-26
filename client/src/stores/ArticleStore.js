const { EventEmitter } = require('events')
const marked = require('marked')
const API = require('../services/API')
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
  API.post('/articles', opts, function(body) {
    ArticleStore.get()
    callback(body)
  })
}

ArticleStore.update = (id, opts) => API.put('/articles/' + id, opts, ArticleStore.get)

ArticleStore.delete = id => API.delete('/articles/' + id, ArticleStore.get)

ArticleStore.get = function(callback, archive) {
  typeof callback === 'function' && callback(articles)
  API.get('/articles' + (archive ? '/archive' : ''), function(body) {
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
  API.get('/articles/' + id, function(article) {
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