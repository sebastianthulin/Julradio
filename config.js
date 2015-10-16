'use strict';

const config = {
  development: {
    mongodbUrl: 'mongodb://localhost/Julradio',
    shoutCastUrl: 'http://s5.voscast.com:7346'
  },
  test: {

  },
  production: {
    mongodbUrl: 'mongodb://localhost/Julradio',
    shoutCastUrl: 'http://s5.voscast.com:7346'
  }
}

module.exports = config[process.env.NODE_ENV || 'development']