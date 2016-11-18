'use strict'

const {IPTimeout, Notification, Block} = require('../models')
const {apiError} = require('./apiError')
const {io} = require('../server')
const {SAFE_USER_SELECT} = require('../constants')

const timeouts = {
  loginattempt: {
    length: 1000,
    strikes: 1
  },
  comment: {
    length: 1, 
    strikes: 1
  },
  requestsong: {
    length: 3600 * 1000, 
    strikes: 1
  },
  chat: {
    length: 2000, 
    strikes: 10
  },
  search: {
    length: 200,
    strikes: 1
  }
}

const performAction = async (ip, action) => {
  const timeout = timeouts[action]
  const docs = await IPTimeout.find({
    ip,
    action,
    expires: {
      $gt: Date.now()
    }
  })
  if (docs.length >= timeout.strikes) {
    throw apiError('TIMEOUT')
  }
  return new IPTimeout({
    ip,
    action,
    expires: Date.now() + timeout.length
  }).save()
}

const notify = ({userId: to, from, type, value}) => {
  const populate = {path: 'from', select: SAFE_USER_SELECT}
  Notification.findOneAndUpdate({
    to, from, type, value
  }, {
    to, from, type, value, date: Date.now()
  }, {
    upsert: true,
    new: true
  }).populate(populate).then(doc => {
    io.to(to).emit('notification:new', doc)
  }).catch(err => {
    console.error('Notify error', err)
  })
}

const blockages = {
  get: async (user1, user2) => {
    const docs = await Block.find({$or: [{
      from: user1,
      target: user2
    }, {
      target: user1,
      from: user2
    }]}).lean()
    if (docs.length === 0) {
      return null
    }
    const isBlocked = !!docs.find(block => block.target == user1)
    const hasBlocked = !!docs.find(block => block.from == user1)
    return {isBlocked, hasBlocked}
  },
  confirm: async (user1, user2) => {
    if (await blockages.get(user1, user2)) {
      throw apiError('BLOCKAGE')
    }
  }
}

// Removes expired timeouts every 10s
setInterval(() => {
  IPTimeout.find({
    expires: {$lte: Date.now()}
  }).remove().exec()
}, 10000)

module.exports = {
  performAction,
  notify,
  blockages
}
