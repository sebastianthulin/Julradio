'use strict';

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../models')

function sendCrew(req, res) {
  db.redis.get('crew', function(err, crewList) {
    crewList = JSON.parse(crewList) || []
    db.User.find({_id: {$in: crewList}}).select('-hash').populate('picture').exec(function(err, docs) {
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

router.put('/', function(req, res, next) {
  if (req.user && req.user.roles.admin) {
    next()
  } else {
    res.sendStatus(500)
  }
}, function(req, res, next) {
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
  next()
}, sendCrew)

module.exports = router