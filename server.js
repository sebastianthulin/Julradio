'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').Server(app),
    io          = require('socket.io')(server)

exports.io = io

app.set('view engine', 'ejs')
app.set('views', './client/views')
app.use(express.static('./public'))
app.use(require('./app/routes'))

server.listen(8080, function() {
  console.log('server started')
})
