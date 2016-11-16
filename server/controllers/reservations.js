'use strict'

const hub = require('clusterhub')
const {Reservation} = require('../models')

const generateData = (b, userId) => {
  const year = new Date().getFullYear()
  const startTime = String(b.startTime).split(':')
  const endTime = String(b.endTime).split(':')
  const startDate = new Date(year, b.month, b.day, startTime[0], startTime[1])
  const endDate = new Date(year, b.month, b.day, endTime[0], endTime[1])

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('INVALID_DATE')
  }

  if (startDate > endDate) {
    endDate.setDate(endDate.getDate() + 1)
  }

  return {
    startDate,
    endDate,
    userId,
    description: b.description
  }
}

exports.create = (req, res, next) => {
  try {
    const reservation = generateData(req.body, req.userId)
    hub.emit('reservations:create', reservation)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.update = (req, res, next) => {
  try {
    const reservation = generateData(req.body, req.userId)
    hub.emit('reservations:edit', {
      id: req.params.id,
      opts: reservation
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.delete = (req, res, next) => {
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
}
