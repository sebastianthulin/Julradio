'use strict';

const db = require('../models')
const getBlockage = require('../services/getBlockage')

function getRandomUser(callback) {
  return db.User.count().then(function(count) {
    const rand = Math.floor(Math.random() * count)
    return db.User.findOne().skip(rand).exec()
  })
}

function datingandstuff(socket) {
  const uid = socket.request.session.uid
  socket.on('meet:random', function handler(fn) {
    if (typeof fn !== 'function') return
    getRandomUser().then(function(user) {
      console.log(user)
      if (user._id == uid) {
        handler(fn)
      } else {
        fn(user)
      }
    })
  })
}

module.exports = datingandstuff