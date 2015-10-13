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

router.get('/crew', sendCrew)

router.get('/schedule', function(req, res) {
  db.redis.get('schedule', function(err, result) {
    res.send({text: result || ''})
  })
})

router.use(function(req, res, next) {
  db.User.findById(req.session.uid).exec().then(function(user) {
    if (user && user.admin) {
      next()
    } else {
      res.sendStatus(404)
    }
  })
})

router.put('/crew', function(req, res, next) {
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

router.put('/schedule', function(req, res) {
  const text = req.body.text
  if (typeof text === 'string') {
    db.redis.set('schedule', text, function(err, result) {
      if (err) {
        res.sendStatus(500)
      } else {
        res.sendStatus(200)
      }
    })
  } else {
    res.sendStatus(500)
  }
})

module.exports = router