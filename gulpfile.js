'use strict';

var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var uglify = require('gulp-uglify')
var stylus = require('gulp-stylus')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var request = require('superagent')

var dependencies = [
  'events',
  'react',
  'socket.io-client',
  'superagent',
  'classnames',
  'react-router'
]

var reload = () => request.post('http://127.0.0.1:8080/reloadclients').end()

gulp.task('js', function() {
  return browserify('./client/src/app', {debug: true})
    .external(dependencies)
    .transform(babelify)
    .bundle()
    .on('error', function(err) {
      console.log(err.toString())
      this.emit('end')
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public'))
    .on('finish', reload)
})

gulp.task('css', function() {
  gulp.src('./client/styles/julradio.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public'))
    .on('finish', reload)
})

gulp.task('vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public'))
})

gulp.task('watch', function() {
  gulp.watch('./client/src/**/*.js', ['js'])
  gulp.watch('./client/styles/**/*.styl', ['css'])
})

gulp.task('build', ['js', 'css', 'vendor'])

gulp.task('default', ['build', 'watch'])