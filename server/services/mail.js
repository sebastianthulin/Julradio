'use strict'

const nodemailer = require('nodemailer')
const config = require('../../config')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: config.email
})

module.exports = transporter
