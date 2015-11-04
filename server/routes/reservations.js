'use strict';

const express = require('express')
const router = express.Router()

router.use(function(req, res, next) {
  if (req.user && req.user.roles.radioHost) {
    next()
  } else {
    res.sendStatus(500)
  }
})

router.post('/', function(req, res) {
  const b = req.body
  process.send({
    service: 'Reservations',
    data: {
      type: 'create',
      opts: {
        userId: req.user._id,
        description: b.description,
        startDate: b.startDate,
        endDate: b.endDate
      }
    }
  })
  res.sendStatus(200)
})

router.put('/:id', function(req, res) {
  const b = req.body
  process.send({
    service: 'Reservations',
    data: {
      type: 'edit',
      id: req.params.id,
      opts: {
        description: b.description,
        startDate: b.startDate,
        endDate: b.endDate
      }
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