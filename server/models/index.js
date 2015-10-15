'use strict';

const fs = require('fs')
const redis = require('redis')

exports.redis = redis.createClient()

for (let file of fs.readdirSync(__dirname)) {
  if (file.match(/\.js$/) && file !== 'index.js') {
    exports[file.substr(0, file.length - 3)] = require('./' + file)
  }
}