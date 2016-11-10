'use strict'

const mongoose = require('mongoose')
const {redis, User} = require('../models')

exports.showAll = (req, res) => {
  redis.get('crew', (err, crewList) => {
    crewList = JSON.parse(crewList) || []
    User.find({_id: {$in: crewList}}).select('-hash -email').exec((err, docs) => {
      const crew = {}
      for (let doc of docs) {
        crew[doc._id] = doc
      }

      // Return to the initial order and filter in case of null's
      const result = crewList.map(id => crew[id]).filter(user => user)
      res.send(result)
    })
  })
}

exports.update = (req, res, next) => {
  const userIds = req.body

  if (!Array.isArray(userIds)) {
    return res.sendStatus(500)
  }

  for (let id of userIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.sendStatus(500)
    }
  }

  redis.set('crew', JSON.stringify(userIds))
  console.log(req.user.username + ' ändrade i crewlist')
  next()
}
