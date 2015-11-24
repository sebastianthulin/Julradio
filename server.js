'use strict';

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const sessions = require('client-sessions')
const config = require('./config')

const sessionMiddleware = sessions({
  cookieName: 'session',
  secret: config.cookieSecret,
  duration: 1000 * 60 * 60 * 24 * 14,
  activeDuration: 1000 * 60 * 60 * 24 * 14
})

exports.io = io

app.set('view engine', 'ejs')
app.set('views', './client/views')
app.enable('trust proxy')
app.use(express.static('./public'))
app.use(sessionMiddleware)
app.use(require('body-parser').json())
app.use(require('./server/routes'))
app.use(require('./server/errorHandler'))

io.adapter(require('socket.io-redis')({
  host: 'localhost',
  port: 6379
}))
io.use((socket, next) => sessionMiddleware(socket.request, {}, next))
io.on('connection', require('./server/sockets'))

server.listen(8080, () => console.log('Server started on port ' + server.address().port))