'use strict';

const config = require('../config')
const io = require('../server').io
const tweets = []

const tw = require('node-tweet-stream')(config.twitterTokens)

config.track.forEach(tw.track.bind(tw))

tw.on('error', err => console.log(err))

tw.on('tweet', function(data) {
  const tweet = {
    id: data.id,
    text: data.text,
    username: data.user.screen_name,
    userimage: data.user.profile_image_url
  }

  io.emit('tweet', tweet)
  tweets.unshift(tweet)
  if (tweets.length === 51) {
    tweets.splice(50, 1)
  }
})

module.exports = socket => socket.emit('tweets', tweets)