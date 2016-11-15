'use strict'

const {Notification} = require('../models')

const populate = {path: 'from', select: '-hash -email'}

exports.showAll = (req, res) => {
  Notification.find({to: req.userId}).populate(populate).then(docs => {
    res.send(docs || [])
  })
}

exports.clear = (req, res) => {
  const b = req.body
  Notification.findOneAndRemove({
    to: req.userId,
    type: b.type,
    value: b.value
  }).exec().then(() => {
    res.sendStatus(200)
  }).catch(() => {
    console.log(arguments)
    res.sendStatus(500)
  })
}
