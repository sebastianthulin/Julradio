'use strict';

const Twitter = require('node-tweet-stream')
const config = require('../config')

const tw = new Twitter(config.twitterTokens)
var tweets = []

tw.track(config.track)

tw.on('error', err => console.log(err))

tw.on('tweet', function(data) {
  const tweet = {
    id: data.id,
    text: data.text,
    username: data.user.screen_name,
    userimage: data.user.profile_image_url
  }

  tweets.unshift(tweet)

  if (tweets.length === 51) {
    tweets.splice(50, 1)
  }

  process.send({ tweet, tweets })
})