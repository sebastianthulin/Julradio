'use strict';

const express = require('express')
const router = express.Router()
const db = require('../models')

router.post('/', function(req, res) {
  const email = req.body.email
  var user

  db.User.findOne({ email }).exec().then(function(doc) {
    if (!doc) {
      return res.status(500).send({err: 'NOUSER'})
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

    Mailer.sendMail({
      from: 'Julradio Admin <grovciabatta@gmail.com>',
      to: email,
      subject: 'Återställ lösenord',
      html,
      text: 'Klicka här för att återställa ditt lösenord..'
    }, function(err, info) {
      if (err) {
        res.status(500).send({err: err.toString()})
      } else {
        res.sendStatus(200)
      }
    })
  })
})

router.param('requestId', function(req, res, next, id) {
  db.PasswordRequest.findById(id).exec().then(function(request) {
    if (!request || Date.now() > request.validTo) {
      throw new Error()
    }
    req.passwordRequest = request
    next()
  }).catch(() => {
    res.status(500).send({err: 'INVALID'})
  })
})

router.get('/:requestId', (req, res) => res.send(req.passwordRequest))

router.post('/:requestId', function(req, res) {
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
  }).catch(function(err) {
    res.status(500).send({err: err.toString()})
  })
})

module.exports = router