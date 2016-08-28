'use strict'

const express = require('express')
const router = express.Router()
const db = require('../models')
const {io} = require('../')
const config = require('../../config')
const pictureRoutes = {}

router.use((req, res, next) => {
  req.userId = req.session.uid
  res.setHeader('Expires', '-1')
  res.setHeader('Cache-Control', 'must-revalidate, private')
  if (!req.userId) return next()
  db.User.findById(req.userId).select('-hash').lean().exec().then(user => {
    if (!user || (user && user.banned)) {
      // Disauth user
      throw new Error()
    }

    req.user = user
    next()
  }).catch(() => {
    req.session.uid = undefined
    next()
  })
})

router.get('/picture/:id', (req, res) => {
  const id = req.params.id
  if (pictureRoutes[id]) {
    return res.redirect(pictureRoutes[id])
  }
  db.Picture.findById(id).exec().then(doc => {
    pictureRoutes[id] = '/i/' + doc._id + doc.extension
    res.redirect(pictureRoutes[id])
  }).catch(() => {
    res.sendStatus(404)
  })
})

router.use(require('./misq'))
router.use('/api/user', require('./user'))
router.use('/api/comment', require('./comment'))
router.use('/api/articles', require('./articles'))
router.use('/api/chat', require('./chat'))
router.use('/api/request', require('./request'))
router.use('/api/notification', require('./notification'))
router.use('/api/reservations', require('./reservations'))
router.use('/api/crew', require('./crew'))
router.use('/api/forgot', require('./forgot'))

if (config.liveReload) {
  router.post('/reloadclients', (req, res) => {
    io.emit('reload')
    res.end()
  })
}

router.get('*', (req, res) => {
  res.render('main', {
    user: req.user,
    analytics: config.analytics,
    playerLess: req.headers['user-agent'] === 'Julradio Android App'
  })
})

module.exports = router
