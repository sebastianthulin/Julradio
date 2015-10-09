'use strict'

const bookshelf = require('./').bookshelf

const Conversation = bookshelf.Model.extend({  
  tableName: 'Conversations',
  // hasTimestamps: true,
  lastMessage: function() {
    return this.belongsTo('Messages', 'lastMessageId')
  },
  messages: function() {
    return this.hasMany('Messages', 'conversationId')
  },
  users: function() {
    return this.belongsToMany('Users', 'UsersConversations', 'conversationId', 'userId')
  }
})

module.exports = bookshelf.model('Conversations', Conversation)