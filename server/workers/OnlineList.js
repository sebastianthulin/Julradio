'use strict';

const io = require('socket.io-emitter')({
  host: '127.0.0.1',
  port: 6379
})
const db = require('../models')

var onlineusers = []

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

function userLeave(userId) {
  const index = onlineusers.indexOf(userId)
  if (index !== -1)
    onlineusers.splice(index, 1)
}

function userJoin(userId) {
  onlineusers.push(userId)
}

function getList() {
  process.send(onlineusers.filter( onlyUnique ))
}

process.on('message', function(data) {
  switch (data.type) {
    case 'join':
      userJoin(data.userId); break
    case 'leave':
      userLeave(data.userId); break
    case 'get':
      getList(); break;
  }
})