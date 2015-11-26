'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')
const mail = require('../services/mail')

router.post('/', function(req, res, next) {
  const email = String(req.body.email).toLowerCase()
  var user

  db.User.findOne({ email }).exec().then(function(doc) {
    if (!email || !doc) {
      throw new Error('INVALID_EMAIL')
    }
    user = doc
    return db.PasswordRequest.findOneAndRemove({ user }).exec()
  }).then(function() {
    return new db.PasswordRequest({ user }).save()
  }).then(function(request) {
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
    }, function(err, info) {
      if (err) {
        throw new Error('UNKNOWN_ERROR')
      }
      res.sendStatus(200)
    })
  }).catch(next)
})

router.param('requestId', function(req, res, next, id) {
  db.PasswordRequest.findById(id).exec().then(function(request) {
    if (!request || Date.now() > request.validTo) {
      throw ''
    }
    req.passwordRequest = request
    next()
  }).catch(() => {
    next(new Error('INVALID_REQUEST_ID'))
  })
})

router.get('/:requestId', (req, res) => res.send(req.passwordRequest))

router.post('/:requestId', function(req, res, next) {
  const b = req.body
  const request = req.passwordRequest
  db.User.findById(request.user).exec().then(function(user) {
    user.setPassword(b.password)
    user.lastVisit = Date.now()
    return user.save()
  }).then(function(user) {
    req.session.uid = user.id
    request.remove()
    res.sendStatus(200)
  }).catch(next)
})

module.exports = router