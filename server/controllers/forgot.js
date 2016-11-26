'use strict'

const {User, PasswordRequest} = require('../models')
const {apiError} = require('../utils/apiError')
const mail = require('../utils/mail')
const config = require('../../config')

exports.request = async (req, res, next) => {
  try {
    const email = String(req.body.email).toLowerCase()
    const user = await User.findOne({email})
    if (!email || !user) {
      throw apiError('INVALID_EMAIL')
    } else if (user.banned) {
      throw apiError('USER_BANNED')
    }
    await PasswordRequest.findOneAndRemove({user})
    const request = await new PasswordRequest({user}).save()
    res.sendStatus(200)
    const resetURL = 'http://julradio.se/forgot/' + request._id
    const html = `
      <h1>Julradio lösenordsåterställning</h1>
      <p>Hej! Du (eller någon annan) har begärt en lösenordsåterställning på ditt konto. Om du inte har begärt detta kan du ignorera mailet. Annars <a href="${resetURL}">tryck här.</a></p>
      <p>God Jul!</p>`

    mail.sendMail({
      from: 'Julradio no-reply <' + config.email.user + '>',
      to: email,
      subject: 'Återställ lösenord',
      html
    }, (err, info) => {
      if (err) {
        console.error(err)
        // console.error(new Error('MAIL_NOT_SENT'))
      }
    })
  } catch (err) {
    next(err)
  }
}

const getPasswordRequest = async requestId => {
  const request = await PasswordRequest.findById(requestId)
  if (!request || Date.now() > request.validTo) {
    throw apiError('INVALID_REQUEST_ID')
  }
  return request
}

exports.show = (req, res, next) => {
  getPasswordRequest(req.params.requestId)
    .then(res.send.bind(res))
    .catch(next)
}

exports.finish = async (req, res, next) => {
  try {
    const request = await getPasswordRequest(req.params.requestId)
    const user = await User.findById(request.user)
    user.setPassword(req.body.password)
    user.lastVisit = Date.now()
    await user.save()
    req.session.uid = user._id
    request.remove()
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}
