'use strict';

const crypto = require('crypto')
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const router = express.Router()
const db = require('../models')

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 2000000
  },
  fileFilter: function(req, file, cb) {
    const isImage = file.mimetype.split('/')[0] === 'image'
    const extension = '.' + file.originalname.split('.').pop().toLowerCase()
    file.extension = extension
    if (isImage) {
      cb(null, true)
    } else {
      cb(new Error('NOT_AN_IMAGE'))
    }
  }
}).single('avatar')

router.get('/logout', function(req, res) {
  req.session.uid = null
  res.redirect('/')
})

router.get('/byname/:username', function(req, res) {
  const username = req.params.username
  db.User.findOne({ username }).select('-hash').populate('picture').exec(function(err, user) {
    user ? res.send(user) : res.sendStatus(200)
  })
})

router.post('/signup', function(req, res) {
  new db.User().signUp(req.body).then(function(user) {
    delete user.hash
    req.session.uid = user.id
    res.send({ user })
  }, function(err) {
    res.status(500).send({err: err.toString()})
  })
})

router.post('/login', function(req, res) {
  const b = req.body
  db.User.findOne({username: b.username}).exec().then(function(user) {
    if (user) {
      if (user.auth(b.password)) {
        user.lastVisit = Date.now()
        user.save()
        req.session.uid = user.id
        res.send({ user })
      } else {
        res.status(500).send({err: 'INCORRECT_PASSWORD'})
      }
    } else {
      res.status(500).send({err: 'USER_NOT_FOUND'})
    }
  })
})

router.use(function(req, res, next) {
  if (req.session.uid) {
    next()
  } else {
    res.status(500).send({err: 'not signed in'})
  }
})

router.put('/settings', function(req, res) {
  const b = req.body
  db.User.findByIdAndUpdate(req.session.uid, {
    email: b.email,
    realname: b.realname,
    description: b.description
  }, {
    new: true
  }).exec().then(function(user) {
    res.send(user)
  })
})

router.put('/password', function(req, res) {
  db.User.findById(req.session.uid).then(function(user) {
    user.updatePassword(req.body)
    return user.save()
  }).then(function() {
    res.sendStatus(200)
  }, function(err) {
    res.status(500).send({err: err.toString()})
  })
})

router.post('/profilepicture', function(req, res) {
  const userId = req.session.uid
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).send({err: 'INVALID_IMAGE'})
    }

    const picture = new db.Picture({
      extension: req.file.extension,
      user: userId
    })

    fs.rename(req.file.path, 'public/i/' + picture._id + picture.extension, function(err) {
      if (err) {
        console.log('/profilepicture error1', err)
        return res.status(500).send({err: 'UNKNOWN_ERROR'})
      }

      picture.save().then(function() {
        return db.User.findByIdAndUpdate(userId, {
          picture: picture._id
        }, {
          new: true
        }).select('-hash').populate('picture').exec()
      }).then(function(user) {
        res.send(user)
      }, function(err) {
        console.log('/profilepicture error2', err)
        res.status(500).send({err: 'UNKNOWN_ERROR'})
      })
    })
  })
})

router.use(function(req, res, next) {
  db.User.findById(req.session.uid).exec().then(function(user) {
    if (user && user.admin) {
      next()
    } else {
      res.sendStatus(404)
    }
  })
})

router.get('/all', function(req, res) {
  db.User.find().select('username admin crew').exec(function(err, users) {
    res.send(users)
  })
})

router.put('/:userId', function(req, res) {
  const b = req.body
  db.User.findByIdAndUpdate(req.params.userId, {
    username: b.username,
    title: b.title,
    admin: b.admin,
    crew: b.crew
  }).exec().then(function() {
    res.sendStatus(200)
  }, function(err) {
    res.status(500).send({err: err.toString()})
  })
})

module.exports = router