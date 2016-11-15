'use strict'

const {Notification} = require('../models')
const {io} = require('../server')

const populate = {path: 'from', select: '-hash -email'}

const Notify = ({userId: to, from, type, value}) => {
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

module.exports = Notify
