'use strict';

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const gm = require('gm')
const fs = require('fs')
const router = express.Router()
const db = require('../models')
const getBlockage = require('../services/getBlockage')
const performAction = require('../services/performAction')

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 8000000
  }
}).single('avatar')

function getUserDoc(userId) {
  return db.User.findById(userId).select('-hash -email').lean().exec()
}

router.get('/logout', function(req, res) {
  req.session.uid = null
  res.redirect('/')
})

router.get('/byname/:username', function(req, res) {
  const usernameLower = String(req.params.username).toLowerCase()
  db.User.findOne({ usernameLower }).select('-hash -email').lean().exec(function(err, user) {
    user ? res.send(user) : res.sendStatus(200)
  })
})

router.get('/profile', function getUser(req, res) {
  const userId = req.query.userId
  const usernameLower = String(req.query.username).toLowerCase()
  const allowed = ['profile', 'block']
  const query = String(req.query.query).split(' ').filter(function(name) {
    const i = allowed.indexOf(name)
    if (i > -1) {
      allowed.splice(i, 1)
      return true
    }
    return false
  })

  new Promise(function(resolve, reject) {
    if (userId) {
      mongoose.Types.ObjectId.isValid(userId)
        ? resolve(userId)
        : reject(new Error('INCORRECT_USER_ID'))
    } else {
      db.User.findOne({ usernameLower }).select('_id').exec().then(doc => doc
        ? resolve(doc._id)
        : reject(new Error('USER_NOT_FOUND'))
      )
    }
  }).then(function(userId) {
    return Promise.all(query.map(function(type) {
      switch (type) {
        case 'profile': return getUserDoc(userId)
        case 'block': return getBlockage(req.session.uid, userId)
      }
    }))
  }).then(function(data) {
    const result = query.reduce(function(prev, type, i) {
      prev[type] = data[i]
      return prev
    }, {})
    res.send(result)
  }).catch(function(err) {
    console.error(err)
    res.sendStatus(500)
  })
})

router.post('/signup', function(req, res, next) {
  new db.User().signUp(req.body).then(function(user) {
    delete user.hash
    req.session.uid = user.id
    res.send({ user })
  }).catch(next)
})

router.post('/login', function(req, res, next) {
  performAction(req.ip, 'loginattempt').then(function() {
    const username = typeof req.body.username === 'string' && req.body.username.toLowerCase()
    return db.User.findOne({usernameLower: username}).exec()
  }).then(function(user) {
    if (user) {
      if (user.banned) {
        throw new Error('USER_BANNED')
      } else if (user.auth(req.body.password)) {
        user.lastVisit = Date.now()
        user.save()
        req.session.uid = user.id
        res.send({ user })
      } else {
        throw new Error('INCORRECT_PASSWORD')
      }
    } else {
      throw new Error('USER_NOT_FOUND')
    }
  }).catch(next)
})

router.use(function(req, res, next) {
  if (req.user) {
    next()
  } else {
    next(new Error('NOT_SIGNED_IN'))
  }
})

router.post('/block', function(req, res) {
  // block a user
  const b = req.body
  db.Block.findOneAndUpdate({
    from: req.session.uid,
    target: b.userId
  }, {
    from: req.session.uid,
    target: b.userId
  }, {
    upsert: true,
    new: true
  }).exec().then(function() {
    res.sendStatus(200)
  }).catch(function() {
    res.sendStatus(500)
  })
})

router.delete('/block/:userId', function(req, res) {
  // unblock a user
  db.Block.findOneAndRemove({
    from: req.session.uid,
    target: req.params.userId
  }).exec().then(function() {
    res.sendStatus(200)
  }).catch(function() {
    res.sendStatus(500)
  })
})

router.put('/settings', function(req, res, next) {
  const b = req.body

  if (['', 'MALE', 'FEMALE'].indexOf(b.gender) === -1) {
    throw new Error('INVALID_GENDER')
  }
  if (b.name.length > 50) {
    throw new Error('NAME_TOO_LONG')
  }
  if (b.location.length > 50) {
    throw new Error('LOCATION_TOO_LONG')
  }
  if (b.description.length > 500) {
    throw new Error('DESCRIPTION_TOO_LONG')
  }
  
  if (b.year && b.month && b.day) {
    var birth = new Date(b.year, b.month, b.day)
    const y1900 = new Date(1900, 0, 0)
    const yNowMinusTen = new Date(new Date().getFullYear() - 10, 0, 0)

    if (!(birth > y1900 && birth < yNowMinusTen)) {
      throw new Error('INVALID_BIRTH')
    }
  }

  db.User.findByIdAndUpdate(req.user._id, {
    name: b.name,
    gender: b.gender,
    location: b.location,
    description: b.description,
    birth
  }, {
    new: true
  }).select('-hash')
    .exec()
    .then(res.send.bind(res))
    .catch(next)
})

router.put('/settings2', function(req, res, next) {
  const b = req.body
  db.User.findById(req.session.uid).exec().then(function(user) {
    if (!user.auth(b.auth)) {
      throw new Error('INCORRECT_PASSWORD')
    }
    if (b.email !== user.email) {
      user.setEmail(b.email)
    }
    if (b.password) {
      user.setPassword(b.password)
    }
    return user.save()
  }).then(function(user) {
    delete user.hash
    res.send(user)
  }).catch(next)
})

router.delete('/avatar', function(req, res, next) {
  db.Picture.findById(req.user.picture).then(function(picture) {
    new db.RemovedPicture(picture).save()
    picture.remove()
    db.User.findByIdAndUpdate(req.user._id, { picture: null })
    .exec().then((user) => req.send(user))
  }).catch(next)
})

router.post('/profilepicture', function(req, res, next) {
  const userId = req.session.uid
  upload(req, res, function(err) {
    if (err) {
      return next(new Error('INVALID_IMAGE'))
    }

    const picture = new db.Picture({
      extension: '.jpg',
      user: userId
    })

    gm(req.file.path)
      .autoOrient()
      .noProfile()   // remove exif
      .write(req.file.path, function(err) {
        gm(req.file.path).size(function(err, value) {
          if (err) {
            fs.unlink(req.file.path)
            return next(new Error('INVALID_IMAGE'))
          }

          var newWidth, newHeight
          const width = value.width
          const height = value.height
          const aspect = width / height
          const newSize = Math.min(Math.max(width, height), 500)

          newWidth = newHeight = newSize
          if (width > height) {
            newWidth = Math.round(newWidth * aspect)
          } else {
            newHeight = Math.round(newHeight / aspect)
          }

          this.resize(newWidth, newHeight, '!')
            .crop(newSize, newSize, (newWidth - newSize) / 2, (newHeight - newSize) / 2)
            .setFormat('jpg')
            .write('public/i/' + picture._id + '.jpg', function(err) {
              fs.unlink(req.file.path)
              if (err) {
                console.error('@/profilepicture handler a', err)
                return next(new Error('UNKNOWN_ERROR'))
              }
              picture.save().then(function() {
                return db.User.findByIdAndUpdate(userId, {
                  picture: picture._id
                }, {
                  new: true
                }).select('-hash').exec()
              }).then(function(user) {
                res.send(user)
              }, function(err) {
                console.error('@/profilepicture handler b', err)
                next(new Error('UNKNOWN_ERROR'))
              })
            })
        })
      })

  })
})

router.use(function(req, res, next) {
  if (req.user && req.user.roles.admin) {
    next()
  } else {
    next(new Error('UNAUTHORISED'))
  }
})

router.get('/all', function(req, res) {
  db.User.find().select('username roles banned').exec(function(err, users) {
    res.send(users)
  })
})

router.delete('/:userId/avatar', function(req, res) {
  db.User.findById(req.params.userId).exec().then(function(user) {
    db.Picture.findById(user.picture).then(function(picture) {
      new db.RemovedPicture(picture).save()
      picture.remove()
      user.picture = null
      user.save()      
      res.sendStatus(200)
    }).catch(function(err) {
      res.status(500).send({err: err.toString()})
    })
  }).catch(function(err) {
    res.status(500).send({err: err.toString()})
  })
})

router.put('/:userId', function(req, res) {
  const b = req.body
  db.User.findByIdAndUpdate(req.params.userId, {
    username: b.username,
    usernameLower: b.username.toLowerCase(),
    title: b.title,
    banned: b.banned,
    roles: {
      admin: b.admin,
      writer: b.admin || b.writer,
      radioHost: b.admin || b.radioHost
    }
  }).exec().then(function() {
    res.sendStatus(200)
  }, function(err) {
    res.status(500).send({err: err.toString()})
  })
})

module.exports = router