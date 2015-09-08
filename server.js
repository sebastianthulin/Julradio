'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').Server(app),
    io          = require('socket.io')(server),
    session     = require('express-session'),
    RedisStore  = require('connect-redis')(session),
    mongoose    = require('mongoose')

var sessionMiddleware = session({
  secret: 'omgdisawesome',
  store: new RedisStore(),
  resave: true,
  saveUninitialized: true,
  // cookie: {secure: true}  // HTTPS only
})

exports.io = io

mongoose.connect('mongodb://localhost/Julradio')
app.set('view engine', 'ejs')
app.set('views', './client/views')
app.use(express.static('./public'))
app.use(require('body-parser').json())
app.use('/api', require('./app/routes/api'))
app.use(sessionMiddleware)
app.use(require('./app/routes'))

io.use(function(socket, next) {
  // Since Socket.io 1.0's middleware API is so close
  // to Express's middleware API, we can use Express middleware
  // directly inside Socket.io without much modification.
  sessionMiddleware(socket.request, {}, next)
})

io.on('connection', require('./app/TweetStream'))
io.on('connection', require('./app/RadioStream'))

server.listen(8080, function() {
  console.log('server started')
})