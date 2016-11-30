'use strict'

const webpack = require('webpack')
const debug = process.env.NODE_ENV !== 'production'
const cfg = require('../config')

const entry = [
  __dirname + '/styles/index.styl',
  __dirname + '/src/index.js'
]

const debugEntry = [
  'webpack-dev-server/client?http://0.0.0.0:' + cfg.webpackPort,
  'webpack/hot/only-dev-server',
  ...entry
]

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      socketTransports: JSON.stringify(cfg.socketTransports),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
]

module.exports = {
  context: __dirname,
  devtool: debug && 'inline-sourcemap',
  entry: debug ? debugEntry : entry,
  output: {
    path: __dirname + '/../public',
    filename: 'app.js',
    publicPath: `http://0.0.0.0:${cfg.webpackPort}/`
  },
  plugins: debug ? [
    ...plugins,
    new webpack.NoErrorsPlugin()
  ] : [
    ...plugins,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}})
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    }]
  },
  devServer: {
    port: cfg.webpackPort
  }
}
