var { EventEmitter } = require('events')
var socket = require('../services/socket')
var TweetStore = new EventEmitter
var tweets = []

socket.on('tweets', function(data) {
  tweets = data
  TweetStore.emit('tweets', tweets)
})

socket.on('tweet', function(tweet) {
  tweets.unshift(tweet)
  TweetStore.emit('tweets', tweets)
})

TweetStore.subscribe = function(handler) {
  handler(tweets)
  TweetStore.on('tweets', handler)
  return function unsubscribe() {
    TweetStore.removeListener('tweets', handler)
  }
}

module.exports = TweetStore