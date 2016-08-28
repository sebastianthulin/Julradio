'use strict'

const db = require('../models')

const getBlockage = (user1, user2) => {
  return new Promise((resolve, reject) => {
    db.Block.find({$or: [{
      from: user1,
      target: user2
    }, {
      target: user1,
      from: user2
    }]}, (err, docs) => {
      if (err) {
        reject(err)
      } else if (docs.length === 0) {
        resolve(null)
      } else {
        let isBlocked = false, hasBlocked = false
        for (let block of docs) {
          if (block.from == user1) {
            hasBlocked = true
          }
          if (block.target == user1) {
            isBlocked = true
          }
        }
        resolve({isBlocked, hasBlocked})
      }
    })
  })
}

const confirmBlockage = (user1, user2) => {
  return new Promise((resolve, reject) => {
    getBlockage(user1, user2).then(blockage => {
      blockage ? reject(new Error('BLOCKAGE')) : resolve()
    }).catch(reject)
  })
}

module.exports = {
  get: getBlockage,
  confirm: confirmBlockage
}
