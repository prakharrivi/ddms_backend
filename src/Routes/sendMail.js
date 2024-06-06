var nodemailer = require('nodemailer')
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
  console.log('get mail')
  contents.from = config.fromEmail
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: error,
      })
    } else
      cb({
        mailsuccess: true,
        data: info,
      })
  })
}

exports.sendemail = (contents, cb) => {
  contents.from = config.fromEmail
  // console.log(contents,"get mail")
  return transporter.sendMail(contents, function (error, info) {
    if (error) {
      console.log(error)
      cb({
        mailsuccess: false,
        data: error,
      })
    } else {
      cb({
        mailsuccess: true,
        data: info,
      })
    }
  })
}
