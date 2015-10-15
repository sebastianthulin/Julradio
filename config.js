'use strict';

const config = {
  development: {
    db: {
      dialect: 'pg',
      host: '127.0.0.1',
      port: 5432,
      username: 'development',
      password: null,
      database: 'Julradio'
    },
    shoutCastUrl: 'http://s5.voscast.com:7346'
  },
  test: {

  },
  production: {
    shoutCastUrl: 'http://s5.voscast.com:7346'
  }
}

module.exports = config[process.env.NODE_ENV || 'development']