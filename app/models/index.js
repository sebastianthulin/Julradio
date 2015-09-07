'use strict';

var fs = require('fs')

var models = fs.readdirSync(__dirname)
for (var i = 0; i < models.length; i++) {
  var model = models[i]
  if (model.substr(model.length - 3) === '.js' && model !== 'index.js') {
    exports[model.substr(0, model.length - 3)] = require('./' + model)
  }
}