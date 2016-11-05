'use strict'

const express = require('express')
const proxy = require('proxy-middleware')
const {app, server, io, webpackServer} = require('./server')
const {session, ioify} = require('./middleware')
const routes = require('./routes')
const errorHandler = require('./errorHandler')
const sockets = require('./sockets')
const cfg = require('../config')

if (process.env.NODE_ENV !== 'production') {
  app.use('/app.js', proxy(`http://localhost:${cfg.webpackPort}/app.js`))
}

app.set('view engine', 'ejs')
app.enable('trust proxy')
app.use(express.static('../public'))
app.use(session)
app.use(routes)
app.use(errorHandler)

io.use(ioify(session))
io.on('connection', sockets)

server.listen(cfg.port, () =>
  console.log('Server started on port ' + server.address().port)
)
