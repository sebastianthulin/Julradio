'use strict';

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const sessionMiddleware = session({
  secret: 'omgdisawesome',
  store: new RedisStore,
  resave: true,
  saveUninitialized: true
})

exports.io = io

app.set('view engine', 'ejs')
app.set('views', './client/views')
// app.enable('trust proxy')
app.use(express.static('./public'))
app.use(sessionMiddleware)
app.use(require('body-parser').json())
app.use(require('./server/routes'))

io.adapter(require('socket.io-redis')({
  host: 'localhost',
  port: 6379
}))
io.use((socket, next) => sessionMiddleware(socket.request, {}, next))
io.on('connection', require('./server/sockets'))

server.listen(8080, () => console.log('Server started on port 8080'))