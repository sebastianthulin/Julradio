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

NewsStore.update = function(id, opts) {
  
}

NewsStore.delete = function(id) {

}

NewsStore.get = function(callback) {
  callback(articles)
  request.get('/api/articles', function(err, res) {
    articles = res.body
    callback(articles)
  })
}

module.exports = NewsStore