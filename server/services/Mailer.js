'use strict';

const nodemailer = require('nodemailer')

const Transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'grovciabatta@gmail.com',
    pass: 'minl0sen'
  }
})

module.exports = Transporter