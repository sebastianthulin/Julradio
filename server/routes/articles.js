'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', function(req, res) {
  db.Article.fetchAll({
    withRelated: ['user']
  }).then(function(model) {
    res.send(model.toJSON())
  }).catch(function(err) {
    console.log(err)
  })
})

router.post('/', function(req, res) {
  const b = req.body
  new db.Article({
    title: b.title,
    content: b.content,
    userId: req.session.uid || 1
  }).save().then(function(model) {
    res.send(model.toJSON())
  })
})

router.put('/:id', function(req, res) {
  const id = req.params.id
  const b = req.body
  new db.Article({id}).save({
    title: b.title,
    content: b.content
  }, {patch: true}).then(function() {
    res.send(true)
  })
  .catch(() => res.send(false))
})

router.delete('/:id', function(req, res) {
  const id = req.params.id
  new db.Article({id}).destroy().then(function() {
    res.send(true)
  })
  .catch(() => res.send(false))
})

module.exports = router