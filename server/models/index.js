'use strict';

const fs = require('fs')
const config = require('../../config')

const knex = require('knex')({
  client: config.db.dialect,
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
  }
})

const db = exports
db.bookshelf = require('bookshelf')(knex)
db.bookshelf.plugin('registry')

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => db[file.substr(0, file.length - 3)] = require('./' + file))

require('../schema')