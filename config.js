'use strict';

const config = {
  development: {
    mongodbUrl: 'mongodb://localhost/Julradio',
    shoutCastUrl: 'http://s5.voscast.com:7346',
    twitterTokens: {
      consumer_key: 'TJdtltXD9Quw715oIYqOgjYB3',
      consumer_secret: 'meCMO8dxLzExeKTB7ZLo6Gqin76NOtylAKemEWGwuPzbPUoNNw',
      token: '2883350073-h7mL232SNhxSvwSEHWqsJkDnbjyilPxFZq1Rj7z',
      token_secret: 'H56tmbnfMPSk9Xm6HVwvgJstHRdFehugVoOEHZIPwbGZj'
    },
    track: 'javascript',
    passwordMinLength: 3
  },
  test: {

  },
  production: {
    mongodbUrl: 'mongodb://localhost/Julradio',
    shoutCastUrl: 'http://s5.voscast.com:7346',
    twitterTokens: {
      consumer_key: 'TJdtltXD9Quw715oIYqOgjYB3',
      consumer_secret: 'meCMO8dxLzExeKTB7ZLo6Gqin76NOtylAKemEWGwuPzbPUoNNw',
      token: '2883350073-h7mL232SNhxSvwSEHWqsJkDnbjyilPxFZq1Rj7z',
      token_secret: 'H56tmbnfMPSk9Xm6HVwvgJstHRdFehugVoOEHZIPwbGZj'
    },
    track: 'julradio',
    passwordMinLength: 6
  }
}

module.exports = config[process.env.NODE_ENV || 'development']