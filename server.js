'use strict';

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const middleware = require('./server/middleware')

exports.io = io

app.set('view engine', 'ejs')
app.set('views', './client/views')
app.enable('trust proxy')
app.use(express.static('./public'))
app.use(middleware.session)
app.use(require('./server/routes'))
app.use(require('./server/errorHandler'))

io.adapter(require('socket.io-redis')({
  host: 'localhost',
  port: 6379
}))
io.use(middleware.ioify(middleware.session))
io.on('connection', require('./server/sockets'))

server.listen(8080, () =>
  console.log('Server started on port ' + server.address().port)
)