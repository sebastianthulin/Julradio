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
  const username = typeof req.params.username === 'string' && req.params.username.toLowerCase()
  db.User.findOne({usernameLower: username}).select('-hash').populate('picture').lean().exec(function(err, user) {
    user ? res.send(user) : res.sendStatus(200)
  })
})

router.get('/wallposts/:userId', function(req, res) {
  db.WallPost.find({
    to: req.params.userId
  }).populate({
    path: 'from',
    select: '-hash'
  }).exec().then(function(posts) {
    db.WallPost.populate(posts, {
      path: 'from.picture',
      model: 'pictures'
    }, function(err, posts) {
      res.send(posts)
    })
  }, function(err) {
    res.send([])
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
  new db.WallPost({
    text: req.body.text,
    to: req.body.userId,
    from: req.session.uid
  }).save(function(err, doc) {
    res.send(doc)
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
    res.status(200).send()
    console.log('block inserted', doc)
  }).catch(function(err) {
    res.status(500).send()
  })

})

router.delete('/block/:userId', function(req, res) {
  // unblock a user
  const b = req.params
  db.Block.findOneAndRemove({
    from: req.session.uid,
    target: b.userId
  }).exec().then(function(doc) {
    res.status(200).send()
    console.log('block removed', doc)
  }).catch(function(err) {
    res.status(500).send()
  })
})

router.get('/profile/:userId', function(req, res) {
  const b = req.params
  db.Block.find({$or: [
    {from: b.userId, target: req.session.uid},
    {target: b.userId, from: req.session.uid}
  ]}, function(err, docs) {
    var isBlocked, hasBlocked;
    for(let i = 0; i < docs.length; i++) {
      const block = docs[i]
      if (block.from == req.session.uid)
        hasBlocked = true
      if (block.target == req.session.uid)
        isBlocked = true
    }
    res.send({ isBlocked, hasBlocked })
  })

  db.Block.findOne({
    from: req.session.uid,
    target: b.userId
  }).exec().then(function(doc) {
    res.send({
      hasBlocked: doc
    })
  }).catch(function(err) {
    res.status(500).send({err: err.toString()})
  })
})

router.put('/field', function(req, res) {
  const b = req.body
  const allow = ['realname', 'gender', 'location', 'description']
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
      extension: req.file.extension,
      user: userId
    })

    fs.rename(req.file.path, 'public/i/' + picture._id + picture.extension, function(err) {
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