'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').Server(app),
    io          = require('socket.io')(server),
    session     = require('express-session'),
    RedisStore  = require('connect-redis')(session)

var sessionMiddleware = session({
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

io.use((socket, next) => sessionMiddleware(socket.request, {}, next))
io.on('connection', require('./server/TweetStream'))
io.on('connection', require('./server/RadioStream'))
io.on('connection', require('./server/Chat'))

server.listen(8080, () => console.log('server started on port 8080'))