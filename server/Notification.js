'use strict';

const db = require('./models')
const io = require('../server').io

const Notification = function(type, to, id) {
  const note = new db.Notification({type, to, id})

  note.save()

  io.to(to).emit('notification:new', note)
}

module.exports = Notification