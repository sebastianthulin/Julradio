'use strict';

const db = require('../models')

const timeouts = {
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
  const now = new Date()
  const timeout = timeouts[action]
  return new Promise(function(resolve, reject) {
    db.IPTimeout.find({ action, ip, expires: {$gt: now}}, function(err, docs) {
      if (err) {
        reject(err)
      } else if (docs.length >= timeout.strikes) {
        reject(new Error('TIMEOUT'))
      } else {
        // remove old
        db.IPTimeout.find({
          action, ip, 
          expires: {$lte: now}
        }).remove().exec()
        
        new db.IPTimeout({
          ip,
          action,
          expires: Date.now() + timeout.length
        }).save(resolve)
      }
    })
  })
}

module.exports = performAction