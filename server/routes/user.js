'use strict';

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const gm = require('gm')
const fs = require('fs')
const router = express.Router()
const db = require('../models')
const getBlockage = require('../services/getBlockage')

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 8000000
  }
}).single('avatar')

function getUserDoc(userId) {
  return db.User.findById(userId).select('-hash').populate('picture').lean().exec()
}

function getWallPosts(userId) {
  return new Promise(function(resolve, reject) {
    db.WallPost.find({
      to: userId
    }).populate({
      path: 'from',
      select: '-hash'
    }).exec().then(function(posts) {
      db.WallPost.populate(posts, {
        path: 'from.picture',
        model: 'pictures'
      }, function(err, posts) {
        err ? reject(err) : resolve(posts)
      })
    }, reject)
  })
}

router.get('/logout', function(req, res) {
  req.session.uid = null
  res.redirect('/')
})

router.get('/byname/:username', function(req, res) {
  const usernameLower = String(req.params.username).toLowerCase()
  db.User.findOne({ usernameLower }).select('-hash').populate('picture').lean().exec(function(err, user) {
    user ? res.send(user) : res.sendStatus(200)
  })
})

router.get('/profile', function getUser(req, res) {
  const userId = req.query.userId
  const usernameLower = String(req.query.username).toLowerCase()
  const allowed = ['profile', 'block', 'wallposts']
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
        : reject(new Error('incorrect userId'))

    } else {
      db.User.findOne({ usernameLower }).select('_id').exec().then(function(doc) {
        doc
          ? resolve(doc._id)
          : reject(new Error('user not found'))
      })
    }
  }).then(function(userId) {
    const promises = []
    for (let i = 0; i < query.length; i++) {
      switch (query[i]) {
        case 'profile':
          promises.push(getUserDoc(userId)); break
        case 'block':
          promises.push(getBlockage(req.session.uid, userId)); break
        case 'wallposts':
          promises.push(getWallPosts(userId)); break
      }
    }

    return Promise.all(promises)
  }).then(function(data) {
    const result = {}
    var i = query.length
    while (i--) {
      result[query[i]] = data[i]
    }
    res.send(result)
  }).catch(function(err) {
    console.log(err)
    res.sendStatus(500)
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
  const username = typeof req.body.username === 'string' && req.body.username.toLowerCase()
  db.User.findOne({usernameLower: username}).exec().then(function(user) {
    if (user) {
      if (user.banned) {
        res.status(500).send({err: 'BANNED'})
      } else if (user.auth(req.body.password)) {
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

router.post('/wallpost', function(req, res) {
  getBlockage(req.session.uid, req.body.userId).then(function(relationship) {
    if (!relationship) {
      new db.WallPost({
        text: req.body.text,
        to: req.body.userId,
        from: req.session.uid
      }).save(function(err, doc) {
        res.send(doc)
      })
    } else {
      res.status(500).send({err: 'Blockad'})
    }
  }).catch(function(err) {
    res.send({err: err.toString()})
  })
})

router.delete('/wallpost/:id', function(req, res) {
  const b = req.params
  db.WallPost.findOne({
    _id: b.id
  }).exec().then(function(post) {
    if (req.user.admin || req.session.uid == post.from || req.session.uid == post.to) {
      post.remove().then(function() {
        res.sendStatus(200)
      })
    } else {
      req.status(500).send({err: 'Du kan inte ta bort detta inlägg'})
    }
  }, function(err) {
    res.status(500).send({err: err.toString()})
  })
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
  }).exec().then(function(doc) {
    res.sendStatus(200)
  }).catch(function(err) {
    res.sendStatus(500)
  })

})

router.delete('/block/:userId', function(req, res) {
  // unblock a user
  db.Block.findOneAndRemove({
    from: req.session.uid,
    target: req.params.userId
  }).exec().then(function(doc) {
    res.sendStatus(200)
  }).catch(function(err) {
    res.sendStatus(500)
  })
})

router.put('/field', function(req, res) {
  const b = req.body
  const allow = ['name', 'gender', 'location', 'description']
  if (allow.indexOf(b.field) > -1) {
    db.User.findByIdAndUpdate(req.session.uid, {
      [b.field]: b.value
    }, {
      new: true
    }).select('-hash').populate('picture').exec().then(function(user) {
      res.send(user)
    }).catch(function(err) {
      console.log('@/field handler', err)
      res.sendStatus(500)
    })
  } else {
    res.sendStatus(500)
  }
})

router.put('/settings', function(req, res) {
  const b = req.body
  db.User.findById(req.session.uid).populate('picture').exec().then(function(user) {
    if (!user.auth(b.auth)) {
      throw new Error('INCORRECT_PASSWORD')
    }
    if (b.email) {
      user.email = b.email
    }
    if (b.password) {
      user.setPassword(b.password)
    }
    return user.save()
  }).then(function(user) {
    delete user.hash
    res.send(user)
  }).catch(function(err) {
    console.log(err)
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
            return res.status(500).send({err: 'INVALID_IMAGE'})
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
                console.log('@/profilepicture handler a', err)
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
                console.log('@/profilepicture handler b', err)
                res.status(500).send({err: 'UNKNOWN_ERROR'})
              })
            })
        })
      })

  })
})

router.use(function(req, res, next) {
  db.User.findById(req.session.uid).exec().then(function(user) {
    if (user && user.admin) {
      next()
    } else {
      res.sendStatus(500)
    }
  })
})

router.get('/all', function(req, res) {
  db.User.find().select('username admin banned').exec(function(err, users) {
    res.send(users)
  })
})

router.put('/:userId', function(req, res) {
  const b = req.body
  db.User.findByIdAndUpdate(req.params.userId, {
    username: b.username,
    usernameLower: b.username.toLowerCase(),
    title: b.title,
    admin: b.admin,
    banned: b.banned
  }).exec().then(function() {
    res.sendStatus(200)
  }, function(err) {
    res.status(500).send({err: err.toString()})
  })
})

module.exports = router