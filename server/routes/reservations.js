'use strict'

const hub = require('clusterhub')
const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const {Reservation} = require('../models')

const generateData = (req, res, next) => {
  const b = req.body
  const year = new Date().getFullYear()
  const startTime = String(b.startTime).split(':')
  const endTime = String(b.endTime).split(':')
  const startDate = new Date(year, b.month, b.day, startTime[0], startTime[1])
  const endDate = new Date(year, b.month, b.day, endTime[0], endTime[1])

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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

router.use(middleware.role('radioHost'))
router.use(middleware.body)

router.post('/', generateData, (req, res) => {
  hub.emit('reservations:create', req.reservation)
  res.sendStatus(200)
})

router.put('/:id', generateData, (req, res) => {
  hub.emit('reservations:edit', {
    id: req.params.id,
    opts: req.reservation
  })
  res.sendStatus(200)
})

router.delete('/:id', (req, res, next) => {
  Reservation.findById(req.params.id).exec().then(doc => {
    if (!doc) {
      res.sendStatus(200)
    } else if (doc.user.toString() == req.userId || req.user.roles.admin) {
      hub.emit('reservations:remove', req.params.id)
      res.sendStatus(200)
    } else {
      throw new Error('UNAUTHORISED')
    }
  }).catch(next)
})

module.exports = router
