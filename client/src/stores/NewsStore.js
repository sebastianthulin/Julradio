const { EventEmitter } = require('events')
const request = require('superagent')
const socket = require('../services/socket')
const NewsStore = new EventEmitter
var articles = []

NewsStore.create = function(opts, callback) {
  request.post('/api/articles', opts, function(err, res) {
    NewsStore.get()
    callback(res.body)
  })
}

NewsStore.update = function(id, opts) {
  request.put('/api/articles/' + id, opts, () => NewsStore.get())
}

NewsStore.delete = function(id) {
  request.del('/api/articles/' + id, () => NewsStore.get())
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

module.exports = NewsStore