'use strict';

const bookshelf = require('./').bookshelf

const Message = bookshelf.Model.extend({
  tableName: 'Messages',
  hasTimestamps: true,
  user: function() {
    return this.belongsTo('Users', 'userId')
  }
})

module.exports = bookshelf.model('Messages', Message)