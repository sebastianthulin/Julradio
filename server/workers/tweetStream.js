'use strict'

const hub = require('clusterhub')
const sio = require('socket.io-emitter')
const Twitter = require('node-tweet-stream')
const {Tweet} = require('../models')
const config = require('../../config')

const io = sio({
  host: '127.0.0.1',
  port: 6379
})

const tw = new Twitter(config.twitterTokens)

let tweets = []

Tweet.find().sort('-_id').limit(50).exec((err, docs) => {
  tweets = docs
  hub.set('tweetStream', tweets)
})

const handleTweet = data => {
  const tweet = new Tweet({
    text: data.text,
    username: data.user.screen_name,
    userImage: data.user.profile_image_url
  })

  tweet.save()
  tweets.unshift(tweet)

  if (tweets.length === 51) {
    tweets.splice(50, 1)
  }

  hub.set('tweetStream', tweets)
  io.emit('feedItem', tweet)
}

const deleteTweet = id => {
  const i = tweets.findIndex(tweet => tweet._id == id)
  if (i > -1) {
    tweets.splice(i, 1)
    Tweet.findByIdAndRemove(id).exec()
    hub.set('tweetStream', tweets)
  }
}

config.track && tw.track(config.track)
tw.on('error', console.error)
tw.on('tweet', handleTweet)
hub.on('tweetStream:delete', deleteTweet)
