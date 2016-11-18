'use strict'

const {Article} = require('../models')
const {SAFE_USER_SELECT} = require('../constants')

const populate = {
  path: 'user',
  select: SAFE_USER_SELECT
}

const select = 'title user date pinned'

// Get frontpage articles
exports.frontPage = (req, res, next) => {
  Promise.all([
    Article.find({pinned: false}).sort('-_id').limit(5).populate(populate),
    Article.find({pinned: true}).sort('-_id').select(select).populate(populate)
  ]).then(data => {
    res.send([...data[0], ...data[1]])
  }).catch(next)
}

// Get all articles w/out articlecontent
exports.list = (req, res, next) => {
  Article.find()
    .select(select)
    .populate(populate)
    .then(res.send.bind(res))
    .catch(next)
}

exports.show = (req, res, next) => {
  Article.findById(req.params.id)
    .populate(populate)
    .then(res.send.bind(res))
    .catch(next)
}

// For writers!
exports.create = (req, res, next) => {
  const b = req.body
  new Article({
    user: b.userless ? undefined : req.userId,
    title: b.title,
    content: b.content
  }).save()
    .then(res.send.bind(res))
    .catch(next)
}

exports.pin = (req, res, next) => {
  const {id, pinned} = req.body
  Article.findByIdAndUpdate(id, {pinned})
    .then(() => res.sendStatus(200))
    .catch(next)
}

exports.update = (req, res, next) => {
  const {title, content} = req.body
  Article.findByIdAndUpdate(req.params.id, {title, content})
    .then(() => res.sendStatus(200))
    .catch(next)
}

exports.delete = (req, res, next) => {
  Article.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(200))
    .catch(next)
}
