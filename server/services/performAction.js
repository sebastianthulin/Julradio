'use strict';

const db = require('../models')

const timeouts = {
  loginattempt: {
    length: 1000,
    strikes: 1
  },
  comment: {
    length: 3000, 
    strikes: 1
  },
  requestsong: {
    length: 3600 * 1000, 
    strikes: 1
  },
  chat: {
    length: 2000, 
    strikes: 10
  }
}

function performAction(ip, action) {
  const timeout = timeouts[action]
  return db.IPTimeout.find({
    ip,
    action,
    expires: {
      $gt: Date.now()
    }
  }).exec().then(function(docs) {
    if (docs.length >= timeout.strikes) {
      throw new Error('TIMEOUT')
    }
    return new db.IPTimeout({
      ip,
      action,
      expires: Date.now() + timeout.length
    }).save()
  })
}

// Removes expired timeouts every 10s
setInterval(function() {
  db.IPTimeout.find({
    expires: {$lte: Date.now()}
  }).remove().exec()
}, 10000)

module.exports = performAction