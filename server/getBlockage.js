'use strict';

const db = require('./models')
const io = require('../server').io

module.exports = function(user1, user2) {
  return new Promise(function(resolve, reject) {
    db.Block.find({$or: [
      {from: user1, target: user2},
      {target: user1, from: user2}
    ]}, function(err, docs) {
      if (docs.length === 0)
        return resolve(null)
      
      var isBlocked, hasBlocked;
      for(let i = 0; i < docs.length; i++) {
        const block = docs[i]
        if (block.from == user1)
          hasBlocked = true
        if (block.target == user1)
          isBlocked = true
      }
      resolve({ isBlocked, hasBlocked })
    })
  })
}