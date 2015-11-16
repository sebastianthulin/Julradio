// const { Promise } = require('es6-promise')
const superagent = require('superagent')
const request = require('superagent-promise')(superagent, Promise)
module.exports = request