const Promise = require('es6-promise').Promise
const superagent = require('superagent')
const request = require('superagent-promise')(superagent, Promise)
module.exports = request