'use strict'

const webpack = require('webpack')
const config = require('../config')
const debug = process.env.NODE_ENV !== 'production'
const packageJSON = require('./package.json')

const app = [
  __dirname + '/styles/index.styl',
  __dirname + '/src/index.js'
]

const vendor = ['events', ...Object.keys(packageJSON.dependencies)]

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  new webpack.DefinePlugin({
    'process.env': {
      shoutCastUrls: JSON.stringify(config.shoutCastUrls),
      socketTransports: JSON.stringify(config.socketTransports),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  })
]

if (debug) {
  app.push('webpack/hot/dev-server')
  app.push(`webpack-dev-server/client?http://localhost:${config.webpackPort}`)
}

module.exports = {
  context: __dirname,
  devtool: debug && 'inline-sourcemap',
  entry: {app, vendor},
  output: {
    path: __dirname + '/../public',
    filename: 'app.js',
    publicPath: `http://localhost:${config.webpackPort}/`
  },
  plugins: debug ? [
    ...plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ] : [
    ...plugins,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
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
  }
}
