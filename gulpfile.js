'use strict';

const gulp = require('gulp')
const util = require('gulp-util')
const browserify = require('browserify')
const envify = require('envify/custom')
const babelify = require('babelify')
const uglify = require('gulp-uglify')
const stylus = require('gulp-stylus')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const request = require('superagent')
const config = require('./config')

const reload = () => request.post('http://127.0.0.1:8080/reloadclients').end()
const production = process.env.NODE_ENV === 'production'
const dependencies = [
  'events',
  'react',
  'redux',
  'immutable',
  'socket.io-client',
  'superagent',
  'react-dom',
  'react-redux',
  'react-router',
  'redux-thunk',
  'classnames',
  'marked',
  'dateformat',
  'history/lib/createBrowserHistory'
]

gulp.task('js', function() {
  return browserify('./client/src', {debug: !production})
    .external(dependencies)
    .transform(envify({
      shoutCastUrls: config.shoutCastUrls,
      socketTransports: config.socketTransports
    }))
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.log(err.toString())
      this.emit('end')
    })
    .pipe(source('app.js'))
    .pipe(production ? buffer() : util.noop())
    .pipe(production ? uglify() : util.noop())
    .pipe(gulp.dest('./public'))
    .on('finish', reload)
})

gulp.task('css', function() {
  gulp.src('./client/styles/julradio.styl')
    .pipe(stylus({compress: production}))
    .pipe(gulp.dest('./public'))
    .on('finish', reload)
})

gulp.task('vendors', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendors.js'))
    .pipe(production ? buffer() : util.noop())
    .pipe(production ? uglify() : util.noop())
    .pipe(gulp.dest('./public'))
})

gulp.task('watch', function() {
  gulp.watch('./client/src/**/*.js', ['js'])
  gulp.watch('./client/styles/**/*.styl', ['css'])
})

gulp.task('build', ['js', 'css', 'vendors'])

gulp.task('default', ['build', 'watch'])