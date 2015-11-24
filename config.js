'use strict';

const config = {
  development: {
    cookieSecret: '=)()"(#FK=?W)IFOK)#"=(URMUPOÅÖDKF',
    mongodbUrl: 'mongodb://localhost/Julradio',
    shoutCastUrl: 'http://s5.voscast.com:7346',
    twitterTokens: {
      consumer_key: 'TJdtltXD9Quw715oIYqOgjYB3',
      consumer_secret: 'meCMO8dxLzExeKTB7ZLo6Gqin76NOtylAKemEWGwuPzbPUoNNw',
      token: '2883350073-h7mL232SNhxSvwSEHWqsJkDnbjyilPxFZq1Rj7z',
      token_secret: 'H56tmbnfMPSk9Xm6HVwvgJstHRdFehugVoOEHZIPwbGZj'
    },
    email: {
      user: 'grovciabatta@gmail.com',
      pass: 'minl0sen'
    },
    // track: 'javascript',   // temporary disabled
    passwordMinLength: 3,
    analytics: false
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
    passwordMinLength: 6,
    analytics: true
  }
}

module.exports = config[process.env.NODE_ENV || 'development']