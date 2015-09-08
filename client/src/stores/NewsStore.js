var { EventEmitter } = require('events')
var request = require('superagent')
var socket = require('../services/socket')
var NewsStore = new EventEmitter
var articles = []

NewsStore.create = function(callback) {
  request.get('/api/article/create', function(err, res) {
    callback(res.body)
  })
}

NewsStore.update = function(id, opts) {
  request.post('/api/article/' + id, opts, () => NewsStore.get())
}

NewsStore.delete = function(id) {
  request.del('/api/article/' + id, () => NewsStore.get())
}

NewsStore.get = function(callback) {
  callback && callback(articles)
  request.get('/api/articles', function(err, res) {
    articles = res.body
    callback && callback(articles)
    NewsStore.emit('articles', articles)
  })
}

NewsStore.subscribe = function(handler) {
  handler(articles)
  NewsStore.on('articles', handler)
  NewsStore.get()
  return function unsubscribe() {
    NewsStore.removeListener('articles', handler)
  }
}

NewsStore.whatever = function(id) {
  // request.del('/api/article/' + id).end()
}

module.exports = NewsStore