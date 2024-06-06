var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/manage_quota')
const manage_quota = mongoose.model('manage_quota')

async function trashdata(req) {
  try {
    let result = await manage_quota.updateOne(
      { _id: req.body._id },
      {
        $set: {
          manage_trash: req.body.data,
        },
      },
      {
        new: true,
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  trashdata,
}
