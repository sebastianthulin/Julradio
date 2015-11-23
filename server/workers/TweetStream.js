'use strict';

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const Twitter = require('node-tweet-stream')
const config = require('../../config')
const db = require('../models')
const tw = new Twitter(config.twitterTokens)

var tweets = []

db.Tweet.find().sort('-_id').limit(50).exec(function(err, docs) {
  tweets = docs
  process.send(tweets)
})

function handleTweet(data) {
  const tweet = new db.Tweet({
    text: data.text,
    username: data.user.screen_name,
    userImage: data.user.profile_image_url
  })

  tweet.save()
  tweets.unshift(tweet)

  if (tweets.length === 51) {
    tweets.splice(50, 1)
  }

  process.send(tweets)
  io.emit('request', tweet)
}

function deleteTweet(id) {
  const i = tweets.findIndex(tweet => tweet._id == id)
  if (i > -1) {
    tweets.splice(i, 1)
    db.Tweet.findByIdAndRemove(id).exec()
    process.send(tweets)
  }
}

config.track && tw.track(config.track)
tw.on('error', console.error.bind(console))
tw.on('tweet', handleTweet)

process.on('message', function(data) {
  switch (data.type) {
    case 'delete':
      deleteTweet(data.id); break
  }
})