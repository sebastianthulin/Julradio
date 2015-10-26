const { EventEmitter } = require('events')
const request = require('superagent')
const marked = require('marked')
const socket = require('../services/socket')
const ArticleStore = new EventEmitter
var articles = []
var schedule

ArticleStore.create = function(opts, callback) {
  request.post('/api/articles', opts).then(function({ body }) {
    ArticleStore.get()
    callback(body)
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

ArticleStore.getSchedule = function(callback, returnCache) {
  returnCache && schedule && callback(schedule)
  request.get('/api/schedule', function(err, { body }) {
    schedule = body
    schedule.marked = marked(schedule.text)
    callback(schedule)
  })
}

ArticleStore.saveSchedule = function(text) {
  return request.put('/api/schedule', { text })
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