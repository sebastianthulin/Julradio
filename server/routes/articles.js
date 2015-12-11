'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

// Get frontpage articles
router.get('/', function(req, res, next) {
  db.Article.find().limit(20).populate({
    path: 'user',
    select: '-hash -email'
  }).exec().then(res.send.bind(res)).catch(next)
})

// Get archived articles
router.get('/archive', function(req, res, next) {
  db.Article.find().populate({
    path: 'user',
    select: '-hash -email'
  }).exec().then(res.send.bind(res)).catch(next)
})

router.get('/:id', function(req, res, next) {
  db.Article.findById(req.params.id).populate({
    path: 'user',
    select: '-hash -email'
  }).exec().then(res.send.bind(res)).catch(next)
})

// Has to be a writer
router.use(function(req, res, next) {
  if (req.user && req.user.roles.writer) {
    next()
  } else {
    next(new Error('UNAUTHORISED'))
  }
})

router.post('/', function(req, res, next) {
  const b = req.body
  new db.Article({
    user: b.userless ? undefined : req.userId,
    title: b.title,
    content: b.content
  }).save().then(function(article) {
    res.send(article)
  }).catch(next)
})

router.put('/:id', function(req, res, next) {
  const id = req.params.id
  const b = req.body
  db.Article.findByIdAndUpdate(id, {
    title: b.title,
    content: b.content
  }).exec().then(function() {
    res.sendStatus(200)
  }).catch(next)
})

router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  db.Article.findByIdAndRemove(id).exec().then(function() {
    res.sendStatus(200)
  }).catch(next)
})

module.exports = router