'use strict';

const express = require('express')
const router = express.Router()
const share = require('../share')
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
    userId: req.userId,
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
  share.emit('Reservations:create', req.reservation)
  res.sendStatus(200)
})

router.put('/:id', generateData, function(req, res) {
  share.emit('Reservations:edit', {
    id: req.params.id,
    opts: req.reservation
  })
  res.sendStatus(200)
})

router.delete('/:id', function(req, res, next) {
  db.Reservation.findById(req.params.id).exec().then(function(doc) {
    if (!doc) {
      res.sendStatus(200)
    } else if (doc.user.toString() == req.userId || req.user.roles.admin) {
      share.emit('Reservations:remove', req.params.id)
      res.sendStatus(200)
    } else {
      throw new Error('UNAUTHORISED')
    }
  }).catch(next)
})

module.exports = router