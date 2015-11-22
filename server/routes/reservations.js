'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

function generateData(req, res, next) {
  const b = req.body
  const year = new Date().getFullYear()
  const startTime = String(b.startTime).split(':')
  const endTime = String(b.endTime).split(':')
  const startDate = new Date(year, b.month, b.day, startTime[0], startTime[1])
  const endDate = new Date(year, b.month, b.day, endTime[0], endTime[1])

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return next(new Error('INVALID_DATE'))
  }

  if (startDate > endDate) {
    endDate.setDate(endDate.getDate() + 1)
  }

  req.reservation = {
    startDate,
    endDate,
    userId: req.user._id,
    description: b.description
  }

  next()
}

router.use(function(req, res, next) {
  if (req.user && req.user.roles.radioHost) {
    next()
  } else {
    res.sendStatus(500)
  }
})

router.post('/', generateData, function(req, res) {
  process.send({
    service: 'Reservations',
    data: {
      type: 'create',
      opts: req.reservation
    }
  })
  res.sendStatus(200)
})

router.put('/:id', generateData, function(req, res) {
  process.send({
    service: 'Reservations',
    data: {
      type: 'edit',
      id: req.params.id,
      opts: req.reservation
    }
  })
  res.sendStatus(200)
})

router.delete('/:id', function(req, res, next) {
  db.Reservation.findById(req.params.id).exec().then(function(doc) {
    if (doc.user.toString() == req.user._id || req.user.roles.admin) {
      process.send({
        service: 'Reservations',
        data: {
          type: 'remove',
          id: req.params.id
        }
      })
      res.sendStatus(200)
    } else {
      throw new Error('UNAUTHORISED')
    }
  }).catch(next)
})

module.exports = router