'use strict'

const mongoose = require('mongoose')
const multer = require('multer')
const gm = require('gm')
const fs = require('fs')
const {User, Activation, Block, Picture, RemovedPicture} = require('../models')
const mail = require('../services/mail')
const config = require('../../config')
const performAction = require('../services/performAction')
const Blockages = require('../services/Blockages')

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 8000000
  }
}).single('avatar')

const getUserDoc = userId => {
  return User.findById(userId).select('-hash -email').lean().exec()
}

exports.logOut = (req, res) => {
  req.session.uid = null
  res.redirect('back')
}

exports.show = (req, res) => {
  const usernameLower = String(req.params.username).toLowerCase()
  User.findOne({usernameLower}).select('-hash -email').lean().exec((err, user) => {
    user ? res.send(user) : res.sendStatus(200)
  })
}

exports.showProfile = (req, res) => {
  const userId = req.query.userId
  const usernameLower = String(req.query.username).toLowerCase()
  const allowed = ['profile', 'block']
  const query = String(req.query.query).split(' ').filter(name => {
    const i = allowed.indexOf(name)
    if (i > -1) {
      allowed.splice(i, 1)
      return true
    }
    return false
  })

  new Promise((resolve, reject) => {
    if (userId) {
      mongoose.Types.ObjectId.isValid(userId)
        ? resolve(userId)
        : reject(new Error('INCORRECT_USER_ID'))
    } else {
      User.findOne({usernameLower}).select('_id').exec().then(doc => doc
        ? resolve(doc._id)
        : reject(new Error('USER_NOT_FOUND'))
      )
    }
  }).then(userId => {
    return Promise.all(query.map(type => {
      switch (type) {
        case 'profile': return getUserDoc(userId)
        case 'block': return Blockages.get(req.userId, userId, true)
      }
    }))
  }).then(data => {
    const result = query.reduce((prev, type, i) => {
      prev[type] = data[i]
      return prev
    }, {})
    res.send(result)
  }).catch(() => {
    res.sendStatus(500)
  })
}

exports.signUp = (req, res, next) => {
  let user
  new User().signUp(req.body).then(doc => {
    user = doc
    return new UserActivation({user: doc._id}).save()
  }).then(activate => {
    res.sendStatus(200)
    const activateURL = 'http://julradio.se/activate/' + activate._id
    const html = `
      <h1>Tjena ${user.username}</h1>
      <p>För att vi ska kunna behålla säkerheten här på Julradio och hålla trolls borta krävs det att du verifierar ditt konto för att kunna posta.</p>
      <p><a href="${activateURL}">${activateURL}</a></p>
      <p>Godjul<br />Julradio</p>`

    mail.sendMail({
      from: 'Julradio no-reply <' + config.email.user + '>',
      to: user.email,
      subject: 'Välkommen till Julradio - Verifikation',
      html
    }, (err, info) => {
      if (err) {
        console.error(new Error('MAIL_NOT_SENT'))
      }
    })
  }).catch(next)
}

exports.logIn = (req, res, next) => {
  performAction(req.ip, 'loginattempt').then(() => {
    const usernameLower = String(req.body.username).toLowerCase()
    return User.findOne({usernameLower}).exec()
  }).then(user => {
    if (user) {
      if (user.banned) {
        throw new Error('USER_BANNED')
      } else if (user.activated === false) {
        throw new Error('USER_NOT_ACTIVATED')
      } else if (user.auth(req.body.password)) {
        user.lastVisit = Date.now()
        user.save()
        req.session.uid = user._id
        res.send({user})
      } else {
        throw new Error('INCORRECT_PASSWORD')
      }
    } else {
      throw new Error('USER_NOT_FOUND')
    }
  }).catch(next)
}

exports.block = (req, res) => {
  // block a user
  const b = req.body
  Block.findOneAndUpdate({
    from: req.userId,
    target: b.userId
  }, {
    from: req.userId,
    target: b.userId
  }, {
    upsert: true,
    new: true
  }).exec().then(() => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(500)
  })
}

exports.unBlock = (req, res) => {
  // unblock a user
  Block.findOneAndRemove({
    from: req.userId,
    target: req.params.userId
  }).exec().then(() => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(500)
  })
}

exports.updateSettings1 = (req, res, next) => {
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
    let birth = new Date(b.year, b.month, b.day)
    const y1900 = new Date(1900, 0, 0)
    const yNowMinusTen = new Date(new Date().getFullYear() - 10, 0, 0)

    if (!(birth > y1900 && birth < yNowMinusTen)) {
      throw new Error('INVALID_BIRTH')
    }
  }

  User.findByIdAndUpdate(req.userId, {
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
}

exports.updateSettings2 = (req, res, next) => {
  const b = req.body
  User.findById(req.userId).exec().then(user => {
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
  }).then(user => {
    user.hash = null
    res.send(user)
  }).catch(next)
}

exports.createProfilePicture = (req, res, next) => {
  const userId = req.userId
  upload(req, res, err => {
    if (err) {
      console.error(err, '/profilepicture INVALID_IMAGE')
      return next(new Error('INVALID_IMAGE'))
    } else if (!req.file) {
      return next(new Error('INVALID_IMAGE'))
    }

    const picture = new Picture({
      extension: '.jpg',
      user: userId
    })

    gm(req.file.path)
      .autoOrient()
      .noProfile()   // remove exif
      .write(req.file.path, err => {
        gm(req.file.path).size((err, value) => {
          if (err) {
            console.error(err, '/profilepicture INVALID_IMAGE')
            fs.unlink(req.file.path)
            return next(new Error('INVALID_IMAGE'))
          }

          let newWidth, newHeight
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
            .write('public/i/' + picture._id + '.jpg', err => {
              fs.unlink(req.file.path)
              if (err) {
                console.error('@/profilepicture handler a', err)
                return next(new Error('UNKNOWN_ERROR'))
              }
              picture.save().then(() => {
                return User.findByIdAndUpdate(userId, {
                  picture: picture._id
                }, {
                  new: true
                }).select('-hash').exec()
              }).then(user => {
                res.send(user)
              }, err => {
                console.error('@/profilepicture handler b', err)
                next(new Error('UNKNOWN_ERROR'))
              })
            })
        })
      })

  })
}

exports.deleteProfilePicture = (req, res, next) => {
  User.findByIdAndUpdate(req.userId, {
    picture: undefined
  }).exec().then(user => {
    if (user.picture) {
      Picture.findById(user.picture).exec().then(picture => {
        return Promise.all([
          new RemovedPicture(picture).save(),
          picture.remove()
        ])
      }).catch(console.error.bind(console))
    }

    user.picture = null
    user.hash = null
    res.send(user)
  }).catch(next)
}

// For admins!
exports.listAll = (req, res) => {
  User.find().select('username roles banned').exec((err, users) => {
    res.send(users)
  })
}

exports.deleteUserProfilePicture = (req, res) => {
  User.findById(req.params.userId).exec().then(user => {
    Picture.findById(user.picture).then(picture => {
      new RemovedPicture(picture).save()
      picture.remove()
      user.picture = null
      user.save()      
      res.sendStatus(200)
    }).catch(err => {
      res.status(500).send({err: err.toString()})
    })
  }).catch(err => {
    res.status(500).send({err: err.toString()})
  })
}

exports.updateUser = (req, res) => {
  const b = req.body
  User.findByIdAndUpdate(req.params.userId, {
    username: b.username,
    usernameLower: b.username.toLowerCase(),
    title: b.title,
    banned: b.banned,
    roles: {
      admin: b.admin,
      writer: b.admin || b.writer,
      radioHost: b.admin || b.radioHost
    }
  }).exec().then(() => {
    res.sendStatus(200)
  }, err => {
    res.status(500).send({err: err.toString()})
  })
}
