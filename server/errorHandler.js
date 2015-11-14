'use strict';

const MongoError = require('mongodb-core/lib/error.js')
const MongooseError = require('mongoose/lib/error.js')

function errorHandler(err, req, res, next) {
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
  if (error.length === 0) {
    console.error('UNHANDLED ERROR:', err)
  }
  res.status(500).send({ error })
  console.error(error)
}

module.exports = errorHandler