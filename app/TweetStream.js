'use strict';

var io = require('../server').io
var tweets = []

var tw = require('node-tweet-stream')({
  consumer_key: 'TJdtltXD9Quw715oIYqOgjYB3',
  consumer_secret: 'meCMO8dxLzExeKTB7ZLo6Gqin76NOtylAKemEWGwuPzbPUoNNw',
  token: '2883350073-h7mL232SNhxSvwSEHWqsJkDnbjyilPxFZq1Rj7z',
  token_secret: 'H56tmbnfMPSk9Xm6HVwvgJstHRdFehugVoOEHZIPwbGZj'
})

tw.track('javascript')

tw.on('tweet', function(data) {
  var tweet = {
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

module.exports = function(socket) {
  socket.emit('tweets', tweets)
}