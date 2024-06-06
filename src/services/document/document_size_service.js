var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/file_size')
const filesize = mongoose.model('file_size')

async function updatefilesize(req) {
  try {
    if (req.body._id) {
      let url = await filesize.updateOne(
        { _id: req.body._id },
        {
          $set: {
            file_size: req.body.file_size,
          },
        },
      )
      if (url) {
        res.send(url)
      }
    } else {
      let data = filesize(req.body)
      let result = await data.save()
      if (result) {
        res.send(result)
      }
    }
  } catch (error) {
    throw error
  }
}

async function getfilesize(req) {
  try {
    var result = await filesize.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  updatefilesize,
  getfilesize,
}
