'use strict';

const bookshelf = require('./').bookshelf

const User = bookshelf.Model.extend({
  tableName: 'Users',
  conversations: function() {
    return this.belongsToMany('Conversations', 'UsersConversations', 'userId', 'conversationId')
  }
})

module.exports = bookshelf.model('Users', User)