'use strict';

const express = require('express')
const router = express.Router()

function generateData(req, res, next) {
  const b = req.body
  const year = new Date().getFullYear()
  const startTime = String(b.startTime).split(':')
  const endTime = String(b.endTime).split(':')
  const startDate = new Date(year, b.month, b.day, startTime[0], startTime[1])
  const endDate = new Date(year, b.month, b.day, endTime[0], endTime[1])

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(500).send({err: 'INVALID_DATE'})
  } else if (Date.now() > startDate) {
    return res.status(500).send({err: 'TOO_EARLY'})
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

router.delete('/:id', function(req, res) {
  process.send({
    service: 'Reservations',
    data: {
      type: 'remove',
      id: req.params.id
    }
  })
  res.sendStatus(200)
})

module.exports = router