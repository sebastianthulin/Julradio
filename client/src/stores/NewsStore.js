var { EventEmitter } = require('events')
var request = require('superagent')
var socket = require('../services/socket')
var NewsStore = new EventEmitter
var articles = []

NewsStore.add = function(opts) {
  var story = {}
  for(var i in opts)
    story[i] = opts[i]
}

NewsStore.update = function(article) {
  request.post('/api/article/' + article._id, article, () => NewsStore.get())
}

NewsStore.delete = function(id) {

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
  request.del('/api/article/' + id).end()
}

module.exports = NewsStore