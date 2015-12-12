const marked = require('marked')
const API = require('../services/API')
const UserStore = require('./UserStore')
const NotificationStore = require('../stores/NotificationStore')
const ArticleStore = {}

var articles = []
var articleById = {}

ArticleStore.transform = function(article) {
  if (article.user) {
    UserStore.insert(article.user)
  } else {
    article.userless = true
  }
  article.date = new Date(article.date)
  if (article.content) {
    article.__html = marked(article.content)
    articleById[article._id] = article
  }
}

ArticleStore.create = (opts, cb) => API.post('/articles', opts, cb)
ArticleStore.delete = (id, cb) => API.delete('/articles/' + id, cb)
ArticleStore.update = (id, opts) => API.put('/articles/' + id, opts, () => {
  NotificationStore.insert({type: 'article'})
})

ArticleStore.get = function(callback) {
  callback(articles)
  API.get('/articles', function(body) {
    articles = body
    articles.forEach(ArticleStore.transform)
    articles.sort((a, b) => b.date - a.date)
    callback(articles)
  })
}

ArticleStore.getAll = function(callback) {
  API.get('/articles/all', function(body) {
    body.forEach(ArticleStore.transform)
    body.sort((a, b) => b.date - a.date)
    callback(body)
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

module.exports = ArticleStore