'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').Server(app),
    io          = require('socket.io')(server),
    mongoose    = require('mongoose')

exports.io = io

mongoose.connect('mongodb://localhost/Julradio')
app.set('view engine', 'ejs')
app.set('views', './client/views')
app.use(express.static('./public'))
app.use('/api', require('./app/routes/api'))
app.use(require('./app/routes'))

io.on('connection', require('./app/TweetStream'))
io.on('connection', require('./app/RadioStream'))

server.listen(8080, function() {
  console.log('server started')
})