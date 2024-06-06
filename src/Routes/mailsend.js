var nodemailer = require('nodemailer')
const { password } = require('../config/service')

var config = require('../config/service')

var smtpConfig = {
  host: config.host,
  port: config.mail_port,
  secure: false,
  auth: {
    user: config.username,
    pass: config.password,
  },
}
let transporter = nodemailer.createTransport(smtpConfig)

exports.emailsender = async function (userData, callback) {
  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.mail_port,
    secure: false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })
  let mailOptions = {
    from: config.fromMail,
    to: userData.email,
    subject: 'User send File URL',
    text:
      ' for ' +
      '' +
      userData.department +
      '' +
      'and designation' +
      ' ' +
      userData.designation +
      ' ' +
      'and file sender name' +
      ' ' +
      userData.usename +
      ' ' +
      'send a file' +
      ' ' +
      userData.notification_message +
      ' ' +
      userData.doc_url,
  }
  let info = await transporter.sendMail(mailOptions)
  callback(info)
}

exports.sendotp = async function (userData, callback) {
  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.mail_port,
    secure: false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })

  let mailOptions = {
    from: config.fromMail,
    to: userData.email,
    subject: 'Send OTP For Reset Password',
    text: 'Your Password vaild up to 10 min' + ' ' + userData.otp,
  }
  let info = await transporter.sendMail(mailOptions)
  callback(info)
}

exports.sendmailnextlevel = async function (userData, callback) {
  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.mail_port,
    secure: false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })
  let mailOptions = {
    from: config.fromMail,
    to: userData.email,
    subject: 'For approve document',
    text: userData.text,
  }
  let info = await transporter.sendMail(mailOptions)
  callback(info)
}

exports.sendusermail = async function (text, callback) {
  let transporter = nodemailer.createTransport({
    host: config.host,
    port: config.mail_port,
    secure: false,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })
  let mailOptions = {
    from: text.email,
    to: config.fromEmail,
    subject: 'User send over Queary',
    text: text.email + ' ' + ' ' + text.description,
  }
  let info = await transporter.sendMail(mailOptions)
  callback(info)
}

exports.GetMailObject = function (to, subject, html, cc, bcc) {
  function MailException(message) {
    this.message = message
    this.name = 'MailException'
  }
  var mailObject = {}
  if (to) mailObject.to = to
  else throw new MailException('To filed is maindatory')
  if (subject) mailObject.subject = subject
  else throw new MailException('Subject is maindatory')

  if (html) mailObject.html = html
  else throw new MailException('Body is maindatory')
  if (cc) mailObject.cc = cc
  if (bcc) mailObject.bcc = bcc
  return mailObject
}

exports.sendEmail = function (contents, cb) {
  contents.from = config.username
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: null,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}

exports.shareemail = function (contents, cb) {
  contents.from = config.fromMail
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: null,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}

exports.sendMail = function (contents, cb) {
  contents.from = config.username
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: null,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}

exports.documentExpiry = function (contents, cb) {
  contents.from = config.fromMail
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: null,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}

exports.downloadrequest = function (contents, cb) {
  contents.from = config.fromMail
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: null,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}

exports.approve = function (contents, cb) {
  contents.from = config.fromMail
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: null,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}
