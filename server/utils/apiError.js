'use strict'

const errorMessages = require('../../lib/errorMessages')

const apiError = (name, status) => {
  return {
    name,
    message: errorMessages[name],
    status: status || 500,
    isApiError: true
  }
}

const errorHandler = (err, req, res, next) => {
  if (err.isApiError) {
    res.status(err.status).send(err)
  } else {
    console.error(req.method, req.url, req.body, req.query, err)
    errorHandler(apiError('UNKNOWN_ERROR'), req, res, next)
  }
}

module.exports = {apiError, errorHandler}
