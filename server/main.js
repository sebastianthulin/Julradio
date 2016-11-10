'use strict'

const express = require('express')
const proxy = require('proxy-middleware')
const {app, server, io, webpackServer} = require('./server')
const {session, ioify, body} = require('./middleware')
const api = require('./api')
const misq = require('./controllers/misq')
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
app.use(body)
app.use(misq.fetchUser)
app.use('/api', api)
app.get('/picture/:id', misq.showPicture)
app.get('/activate/:userActivationId', misq.activateUser)
app.get('/inc/now_playing.php', misq.showNowPlaying)
app.get('*', misq.renderPage)
app.use(errorHandler)

io.use(ioify(session))
io.on('connection', sockets)

server.listen(cfg.port, () =>
  console.log('Server started on port ' + server.address().port)
)
