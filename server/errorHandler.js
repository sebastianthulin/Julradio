'use strict'

const MongoError = require('mongodb-core/lib/error.js')
const MongooseError = require('mongoose/lib/error.js')
const errors = require('../client/src/errors')

const errorHandler = (err, req, res, next) => {
  const error = []
  if (err instanceof MongooseError) {
    for (let key in err.errors) {
      error.push(err.errors[key].message)
    }
  } else if (err instanceof MongoError) {
    if (err.code === 11000) {
      error.push('DUPLICATE')
    }
  } else if (err instanceof Error) {
    error.push(err.message)
  }
  let i = error.length
  while (i--) {
    if (!errors[error[i]]) {
      console.error(err, req.ip, req.user ? req.user.username : '')
      error[i] = 'UNKNOWN_ERROR'
    }
  }
  res.status(500).send({error})
}

module.exports = errorHandler
