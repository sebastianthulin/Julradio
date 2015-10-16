'use strict';

const mongoose = require('mongoose')
const redis = require('redis')
const fs = require('fs')
const config = require('../../config')

mongoose.Promise = Promise
mongoose.connect(config.mongodbUrl)

exports.redis = redis.createClient()

for (let file of fs.readdirSync(__dirname)) {
  if (file.match(/\.js$/) && file !== 'index.js') {
    exports[file.substr(0, file.length - 3)] = require('./' + file)
  }
}