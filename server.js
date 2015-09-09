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
  saveUninitialized: true
})

exports.io = io

mongoose.connect('mongodb://localhost/Julradio')
app.set('view engine', 'ejs')
app.set('views', './client/views')
app.use(express.static('./public'))
app.use(sessionMiddleware)
app.use(require('body-parser').json())
app.use('/api', require('./app/routes/api'))
app.use(require('./app/routes'))

io.use((socket, next) => sessionMiddleware(socket.request, {}, next))
io.on('connection', require('./app/TweetStream'))
io.on('connection', require('./app/RadioStream'))

server.listen(8080, () => console.log('server started on port 8080'))