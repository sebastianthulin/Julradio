'use strict';

const bookshelf = require('./').bookshelf

const UserConversations = bookshelf.Model.extend({
  tableName: 'UsersConversations'
})

module.exports = bookshelf.model('UsersConversations', UserConversations)