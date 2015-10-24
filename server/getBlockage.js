'use strict';

const db = require('./models')

module.exports = function(user1, user2) {
  return new Promise(function(resolve, reject) {
    db.Block.find({$or: [{
      from: user1,
      target: user2
    }, {
      target: user1,
      from: user2
    }]}, function(err, docs) {
      if (err) {
        reject(err)
      } else if (docs.length === 0) {
        resolve(null)
      } else {
        var isBlocked = hasBlocked = false
        for (let i = 0; i < docs.length; i++) {
          const block = docs[i]
          if (block.from == user1) {
            hasBlocked = true
          }
          if (block.target == user1) {
            isBlocked = true
          }
        }
        resolve({ isBlocked, hasBlocked })
      }
    })
  })
}