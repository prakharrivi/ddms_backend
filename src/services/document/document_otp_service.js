var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/OTP')
const OTP = mongoose.model('OTP')

async function documentOTP(req) {
  try {
    let minm = 100000
    let maxm = 999999
    let otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm
    req.body.otp = otp
    let data = new OTP(req.body)
    let result = await data.save()

    let template_url = 'assets/template/otp.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      content = content.replace('$otp$', req.body.otp)
      var mailObject = await mailsender.GetMailObject(
        'sgrishma735@gmail.com',
        ' sdkl ',
        content,
        null,
        null,
      )
      mailsender.sendEmail(mailObject, function (mailres) {
        // return { status: 200, data: mailres }
        if (!mailres) {
          console.log('failed')
        } else {
          console.log('sent')
        }
      })
    })

    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function verifyOTP(req) {
  try {
    var result = await OTP.aggregate([{ $match: { otp: req.body.otp } }])
    console.log(result)
    // res.send(result);
    return result
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

async function deleteotp(req) {
  try {
    var result = await OTP.deleteOne({ _id: req.params.id }).exec()

    console.log(result)
    return result
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

module.exports = {
  documentOTP,
  verifyOTP,
  deleteotp,
}
