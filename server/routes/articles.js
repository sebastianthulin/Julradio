'use strict'

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const middleware = require('../middleware')
const db = require('../models')

const populate = {
  path: 'user',
  select: '-hash -email'
}

const select = 'title user date pinned'

// Get frontpage articles
router.get('/', (req, res, next) => {
  Promise.all([
    db.Article.find({pinned: false}).sort('-_id').limit(5).populate(populate).exec(),
    db.Article.find({pinned: true}).sort('-_id').select(select).populate(populate).exec()
  ])
    .then(data => res.send([...data[0], ...data[1]]))
    .catch(next)
})

// Get all articles w/out articlecontent
router.get('/all', (req, res, next) => {
  db.Article.find()
    .select(select)
    .populate(populate)
    .exec()
    .then(res.send.bind(res))
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  db.Article.findById(req.params.id)
    .populate(populate)
    .exec()
    .then(res.send.bind(res))
    .catch(next)
})

// Has to be a writer
router.use(middleware.role('writer'))
router.use(middleware.body)

router.post('/', (req, res, next) => {
  const b = req.body
  new db.Article({
    user: b.userless ? undefined : req.userId,
    title: b.title,
    content: b.content
  }).save()
    .then(res.send.bind(res))
    .catch(next)
})

router.put('/pin', (req, res, next) => {
  const id = req.body.id
  const pinned = req.body.pinned
  db.Article.findByIdAndUpdate(id, {pinned})
    .exec()
    .then(() => res.sendStatus(200))
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  const b = req.body
  db.Article.findByIdAndUpdate(req.params.id, {
    title: b.title,
    content: b.content
  }).exec()
    .then(() => res.sendStatus(200))
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  db.Article.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.sendStatus(200))
    .catch(next)
})

module.exports = router
