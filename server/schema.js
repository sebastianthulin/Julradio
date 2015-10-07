'use strict';

const db = require('./models')
const knex = db.bookshelf.knex

knex.schema.hasTable('Users').then(function(exists) {
  if (exists) return
  knex.schema.createTable('Users', function(table) {
    table.increments('id').primary()
    table.string('username', 25)
    table.string('email')
    table.string('hash')
  }).then(function(table) {
    console.log('Created Users.')
  })
})

knex.schema.hasTable('Conversations').then(function(exists) {
  if (exists) return
  knex.schema.createTable('Conversations', function(table) {
    table.increments('id').primary()
    table.integer('lastMessageId')
      .unsigned()
      .references('Messages.id')

  }).then(function(table) {
    console.log('Created Conversations.')
  })
})

knex.schema.hasTable('Messages').then(function(exists) {
  if (exists) return
  knex.schema.createTable('Messages', function(table) {
    table.increments('id').primary()
    table.text('text')

    table.integer('conversationId')
      .unsigned()
      .references('Conversations.id')

    table.integer('userId')
      .unsigned()
      .references('Users.id')

  }).then(function(table) {
    console.log('Created Messages.')
  })
})

knex.schema.hasTable('UsersConversations').then(function(exists) {
  if (exists) return
  knex.schema.createTable('UsersConversations', function(table) {
    table.increments('id').primary()

    table.integer('userId')
      .unsigned()
      .references('Users.id')

    table.integer('conversationId')
      .unsigned()
      .references('Conversations.id')

  }).then(function(table) {
    console.log('Created "UsersConversations" join table.')
  })
})

knex.schema.hasTable('Articles').then(function(exists) {
  if (exists) return
  knex.schema.createTable('Articles', function(table) {
    table.increments('id').primary()
    table.string('title')
    table.text('content')

    table.integer('userId')
      .unsigned()
      .references('Users.id')

  }).then(function(table) {
    console.log('Created "UsersConversations" join table.')
  })
})