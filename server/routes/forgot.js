'use strict'

const express = require('express')
const router = express.Router()
const middleware = require('../middleware')
const db = require('../models')
const mail = require('../services/mail')
const config = require('../../config')

router.use(middleware.body)

router.post('/', (req, res, next) => {
  const email = String(req.body.email).toLowerCase()
  let user

  db.User.findOne({email}).exec().then(doc => {
    if (!email || !doc) {
      throw new Error('INVALID_EMAIL')
    } else if (doc.banned) {
      throw new Error('USER_BANNED')
    }
    user = doc
    return db.PasswordRequest.findOneAndRemove({user}).exec()
  }).then(() => {
    return new db.PasswordRequest({user}).save()
  }).then(request => {
    res.sendStatus(200)
    const resetURL = 'http://julradio.se/forgot/' + request._id
    const html = `
      <h1>Julradio lösenordsåterställning</h1>
      <p>Hej! Du (eller någon annan) har begärt en lösenordsåterställning på ditt konto. Om du inte har begärt detta kan du ignorera mailet. Annars tryck <a href="${resetURL}">här</a></p>
      <p>God Jul!</p>`

    mail.sendMail({
      from: 'Julradio no-reply <' + config.email.user + '>',
      to: email,
      subject: 'Återställ lösenord',
      html
    }, (err, info) => {
      if (err) {
        console.error(new Error('MAIL_NOT_SENT'))
      }
    })
  }).catch(next)
})

router.param('requestId', (req, res, next, id) => {
  db.PasswordRequest.findById(id).exec().then(request => {
    if (!request || Date.now() > request.validTo) {
      throw ''
    }
    req.passwordRequest = request
    next()
  }).catch(() => {
    next(new Error('INVALID_REQUEST_ID'))
  })
})

router.get('/:requestId', (req, res) => res.send(req.passwordRequest))

router.post('/:requestId', (req, res, next) => {
  const b = req.body
  const request = req.passwordRequest
  db.User.findById(request.user).exec().then(user => {
    user.setPassword(b.password)
    user.lastVisit = Date.now()
    return user.save()
  }).then(user => {
    req.session.uid = user._id
    request.remove()
    res.sendStatus(200)
  }).catch(next)
})

module.exports = router
