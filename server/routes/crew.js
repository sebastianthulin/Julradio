'use strict'

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const middleware = require('../middleware')
const db = require('../models')

const sendCrew = (req, res) => {
  db.redis.get('crew', (err, crewList) => {
    crewList = JSON.parse(crewList) || []
    db.User.find({_id: {$in: crewList}}).select('-hash -email').exec((err, docs) => {
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

router.get('/', sendCrew)
router.use(middleware.role('admin'))
router.use(middleware.body)

router.put('/', (req, res, next) => {
  const userIds = req.body

  if (!Array.isArray(userIds)) {
    return res.sendStatus(500)
  }

  for (let id of userIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.sendStatus(500)
    }
  }

  db.redis.set('crew', JSON.stringify(userIds))
  console.log(req.user.username + ' ändrade i crewlist')
  next()
}, sendCrew)

module.exports = router
