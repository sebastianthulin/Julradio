const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const redis = require('socket.io-redis')

io.adapter(redis({host: 'localhost', port: 6379}))

module.exports = {app, server, io}
