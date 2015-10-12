'use strict';

const fs = require('fs')

for (let file of fs.readdirSync(__dirname)) {
  if (file.substr(file.length - 3) === '.js' && file !== 'index.js') {
    exports[file.substr(0, file.length - 3)] = require('./' + file)
  }
}