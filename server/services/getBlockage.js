'use strict';

const db = require('../models')

function getBlockage(user1, user2) {
  db.User.findById(user1).exec().then(function(user) {
    console.log(user)
  })
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
        var isBlocked = false, hasBlocked = false
        for (let block of docs) {
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

module.exports = getBlockage