'use strict'

const express = require('express')
const router = express.Router()
const share = require('../share')
const middleware = require('../middleware')
const db = require('../models')

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
  share.emit('Reservations:create', req.reservation)
  res.sendStatus(200)
})

router.put('/:id', generateData, (req, res) => {
  share.emit('Reservations:edit', {
    id: req.params.id,
    opts: req.reservation
  })
  res.sendStatus(200)
})

router.delete('/:id', (req, res, next) => {
  db.Reservation.findById(req.params.id).exec().then(doc => {
    if (!doc) {
      res.sendStatus(200)
    } else if (doc.user.toString() == req.userId || req.user.roles.admin) {
      share.emit('Reservations:remove', req.params.id)
      res.sendStatus(200)
    } else {
      throw new Error('UNAUTHORISED')
    }
  }).catch(next)
})

module.exports = router
