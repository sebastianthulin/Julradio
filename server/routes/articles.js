'use strict';

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const middleware = require('../middleware')
const db = require('../models')

const populate = {
  path: 'user',
  select: '-hash -email'
}

// Get frontpage articles
router.get('/', function(req, res, next) {
  db.redis.get('pinned', function(err, pinnedId) {
    const promises = [
      db.Article.find().sort('-date').limit(5).populate(populate).exec()
    ]
    pinnedId && promises.push(
      db.Article.findById(pinnedId).populate(populate).exec()
    )
    Promise.all(promises).then(data => {
      const articles = data[0]
      const pinned = data[1]
      if (pinned) {
        const i = articles.findIndex(a => a._id == pinnedId)
        if (i > -1) {
          articles.splice(i, 1)
        }
      }
      res.send({
        articles,
        pinned
      })
    }).catch(next)
  })
})

// Get all articles w/out articlecontent
router.get('/all', function(req, res, next) {
  db.redis.get('pinned', function(err, pinnedId) {
    db.Article.find()
      .select('title user date')
      .populate(populate)
      .exec()
      .then(articles => {
        res.send({
          articles,
          pinnedId
        })
      })
      .catch(next)
  })
})

router.get('/:id', function(req, res, next) {
  db.Article.findById(req.params.id)
    .populate(populate)
    .exec()
    .then(res.send.bind(res))
    .catch(next)
})

// Has to be a writer
router.use(middleware.role('writer'))
router.use(middleware.body)

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

router.put('/pin', function(req, res) {
  const id = req.body.id
  if (!id) {
    db.redis.del('pinned')
    res.sendStatus(200)
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    res.sendStatus(500)
  } else {
    db.redis.set('pinned', id)
    res.sendStatus(200)
  }
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
  db.redis.get('pinned', function(err, pinnedId) {
    if (pinnedId === id) {
      db.redis.del('pinned')
    }
    db.Article.findByIdAndRemove(id).exec().then(function() {
      res.sendStatus(200)
    }).catch(next)
  })
})

module.exports = router