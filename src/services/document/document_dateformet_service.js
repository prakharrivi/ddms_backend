var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/dateformat')
const formatdate = mongoose.model('dateformat')

async function getdateformat(req) {
  try {
    var result = await formatdate.find()
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updatedateformat(req) {
  try {
    if (req.body._id) {
      let url = await formatdate.updateOne(
        { _id: req.body._id },
        {
          $set: {
            formatdate: req.body.formatdate,
          },
        },
      )
      if (url) {
        // res.send(url)
        return url
      }
    } else {
      let data = formatdate(req.body)
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
  getdateformat,
  updatedateformat,
}
