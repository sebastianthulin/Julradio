const Promise = require('bluebird')
const superagent = require('superagent')
const request = require('superagent-promise')(superagent, Promise)
module.exports = request