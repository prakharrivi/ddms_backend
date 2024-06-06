var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/admin_number')
const admin_data = mongoose.model('admin_number')

async function getadminnumber(req) {
  try {
    var result = await admin_data.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updatehelp(req) {
  try {
    if (req.body._id) {
      let url = await admin_data.updateOne(
        { _id: req.body._id },
        {
          $set: {
            adminemail: req.body.adminemail,
            adminnumber: req.body.adminnumber,
          },
        },
      )
      if (url) {
        // res.send(url)
        return url
      }
    } else {
      let data = admin_data(req.body)
      let result = await data.save()
      if (result) {
        // res.send(result)
        return result
      }
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getadminnumber,
  updatehelp,
}
