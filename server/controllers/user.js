'use strict'

const multer = require('multer')
const gm = require('gm')
const fs = require('fs')
const {User, Activation, Block, Picture, RemovedPicture} = require('../models')
const {performAction, blockages} = require('../utils/userUtils')
const userSearch = require('../utils/userSearch')
const mail = require('../utils/mail')
const config = require('../../config')
const {SENSITIVE_USER_SELECT, SAFE_USER_SELECT} = require('../constants')

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 8000000
  }
}).single('avatar')

const getUserDoc = ({userId: _id, username}) => {
  const usernameLower = typeof username === 'string' && username.toLowerCase()
  const query = _id ? {_id} : {usernameLower}
  return User.findOne(query).select(SAFE_USER_SELECT).lean().exec()
}

exports.logOut = (req, res) => {
  req.session.uid = null
  res.redirect('back')
}

exports.show = (req, res) => {
  const usernameLower = String(req.params.username).toLowerCase()
  User.findOne({usernameLower}).select(SAFE_USER_SELECT).lean().exec((err, user) => {
    user ? res.send(user) : res.sendStatus(200)
  })
}

exports.search = async (req, res, next) => {
  try {
    await performAction(req.ip, 'search')
    res.send(userSearch(req.query.query))
  } catch (err) {
    next(err)
  }
}

exports.showProfile = async (req, res, next) => {
  try {
    const {userId, username} = req.query
    const requestTypes = String(req.query.query).split(' ')
    const allowed = ['profile', 'block']
    const query = allowed.filter(name => requestTypes.indexOf(name) > -1)

    const user = await getUserDoc({userId, username})

    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }

    const data = await Promise.all(query.map(type => {
      switch (type) {
        case 'profile': return Promise.resolve(user)
        case 'block': return blockages.get(req.userId, user._id, true)
      }
    }))

    const result = {}
    query.forEach((type, i) => result[type] = data[i])
    res.send(result)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

exports.signUp = async (req, res, next) => {
  try {
    const user = await new User().signUp(req.body)
    const activate = await new UserActivation({user: doc._id}).save()
    res.sendStatus(200)
    const activateURL = 'http://julradio.se/activate/' + activate._id
    const html = `
      <h1>Tjena ${user.username}</h1>
      <p>För att vi ska kunna behålla säkerheten här på Julradio och hålla trolls borta krävs det att du verifierar ditt konto för att kunna posta.</p>
      <p><a href="${activateURL}">${activateURL}</a></p>
      <p>Godjul<br />Julradio</p>
    `

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
  } catch (err) {
    next(err)
  }
}

exports.logIn = async (req, res, next) => {
  try {
    await performAction(req.ip, 'loginattempt')
    const usernameLower = String(req.body.username).toLowerCase()
    const user = await User.findOne({usernameLower}).exec()
    if (user) {
      if (user.banned) {
        throw new Error('USER_BANNED')
      } else if (user.activated === false) {
        throw new Error('USER_NOT_ACTIVATED')
      } else if (user.auth(req.body.password)) {
        user.lastVisit = Date.now()
        user.save()
        req.session.uid = user._id
        res.sendStatus(200)
      } else {
        throw new Error('INCORRECT_PASSWORD')
      }
    } else {
      throw new Error('USER_NOT_FOUND')
    }
  } catch (err) {
    next(err)
  }
}

exports.block = (req, res) => {
  const from = req.userId
  const target = req.body.userId
  Block.findOneAndUpdate({from, target}, {from, target}, {
    upsert: true,
    new: true
  }).then(() => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(500)
  })
}

exports.unBlock = (req, res) => {
  Block.findOneAndRemove({
    from: req.userId,
    target: req.params.userId
  }).exec().then(() => {
    res.sendStatus(200)
  }).catch(() => {
    res.sendStatus(500)
  })
}

exports.updateSettings1 = async (req, res, next) => {
  try {
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
    
    const birth = b.year && b.month && b.day && new Date(b.year, b.month, b.day)

    if (birth) {
      const y1900 = new Date(1900, 0, 0)
      const yNowMinusTen = new Date(new Date().getFullYear() - 10, 0, 0)

      if (!(birth > y1900 && birth < yNowMinusTen)) {
        throw new Error('INVALID_BIRTH')
      }
    }

    const user = await User.findByIdAndUpdate(req.userId, {
      name: b.name,
      gender: b.gender,
      location: b.location,
      description: b.description,
      birth
    }, {new: true}).select(SENSITIVE_USER_SELECT).lean()

    res.send(user)
  } catch (err) {
    next(err)
  }
}

exports.updateSettings2 = async (req, res, next) => {
  try {
    const b = req.body
    const user = await User.findById(req.userId)
    if (!user.auth(b.auth)) {
      throw new Error('INCORRECT_PASSWORD')
    }
    if (b.email !== user.email) {
      user.setEmail(b.email)
    }
    if (b.password) {
      user.setPassword(b.password)
    }
    await user.save()
    user.hash = null
    res.send(user)
  } catch (err) {
    next(err)
  }
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
                }).select(SENSITIVE_USER_SELECT).exec()
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

exports.deleteProfilePicture = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, {picture: undefined}).lean()
    if (user.picture) {
      const picture = await Picture.findById(user.picture)
      await Promise.all([
        new RemovedPicture(picture).save(),
        picture.remove()
      ])
    }

    user.picture = null
    user.hash = null
    res.send(user)
  } catch (err) {
    next(err)
  }
}

// For admins!
exports.listAll = (req, res, next) => {
  User.find().select('username roles banned').lean().then(users => {
    res.send(users)
  }).catch(next)
}

exports.deleteUserProfilePicture = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    const picture = await Picture.findById(user.picture)
    user.picture = null
    await Promise.all([
      new RemovedPicture(picture).save(),
      picture.remove(),
      user.save()      
    ])
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const b = req.body
    await User.findByIdAndUpdate(req.params.userId, {
      username: b.username,
      usernameLower: b.username.toLowerCase(),
      title: b.title,
      banned: b.banned,
      roles: {
        admin: b.admin,
        writer: b.admin || b.writer,
        radioHost: b.admin || b.radioHost
      }
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}
