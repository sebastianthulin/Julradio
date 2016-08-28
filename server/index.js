'use strict'

const express = require('express')
const proxy = require('proxy-middleware')
const {app, server, io, webpackServer} = require('./server')
const {session, ioify} = require('./middleware')
const routes = require('./routes')
const errorHandler = require('./errorHandler')
const sockets = require('./sockets')
const config = require('../config')

if (process.env.NODE_ENV !== 'production') {
  webpackServer().listen(config.webpackPort)
  app.use('/app.js', proxy(`http://localhost:${config.webpackPort}/app.js`))
  app.use('/vendor.js', proxy(`http://localhost:${config.webpackPort}/vendor.js`))
}

app.set('view engine', 'ejs')
app.enable('trust proxy')
app.use(express.static('../public'))
app.use(session)
app.use(routes)
app.use(errorHandler)

io.use(ioify(session))
io.on('connection', sockets)

server.listen(config.port, () =>
  console.log('Server started on port ' + server.address().port)
)
