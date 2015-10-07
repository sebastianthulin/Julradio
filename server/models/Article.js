'use strict';

const bookshelf = require('./').bookshelf

const Article = bookshelf.Model.extend({
  tableName: 'Articles',
  user: function() {
    return this.belongsTo('Users', 'userId')
  }
})

module.exports = bookshelf.model('Articles', Article)