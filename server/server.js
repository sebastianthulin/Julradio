const express = require('express')
const http = require('http')
const sio = require('socket.io')
const redis = require('socket.io-redis')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const webpackConfig = require('../client/webpack.config')

const app = express()
const server = http.Server(app)
const io = sio(server)

const webpackServer = () => {
  return new webpackDevServer(webpack(webpackConfig), {
    hot: true,
    noInfo: true
  })
}

io.adapter(redis({host: 'localhost', port: 6379}))

module.exports = {app, server, io, webpackServer}
