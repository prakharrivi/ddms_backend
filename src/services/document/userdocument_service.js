var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/Users')
const User = mongoose.model('Users')

async function documentmail(req) {
  try {
    let result = await User.findOne({ email: req.body.emailtag })
    if (result) {
      let data = await User.updateOne(
        { email: req.body.emailtag },
        {
          $push: {
            folderbase: {
              subkeyword: req.body.subkeyword,
              contentkeyword: req.body.contentkeyword,
            },
          },
        },
        {
          new: true,
        },
      )
      if (data) {
        return { status: 200, text: data }
      }
    } else {
      return { status: 400, text: 'this email id not register in this DDMS' }
    }
  } catch (error) {
    throw error
  }
}

async function finduserdata(req) {
  try {
    let result = await User.findOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return { status: 200, data: result }
    } else {
      return { status: 204, data: 'no record data ' }
    }
  } catch (error) {
    throw error
  }
}

async function getnextleveluser(req) {
  try {
    let result = await User.find({
      selectdeparament: req.body.selectdeparament,
      verfication_level: req.body.verfication,
    })
    if (result) {
      return { data: result, status: 200 }
    } else {
      return { data: 'no user found', status: 400 }
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  documentmail,
  finduserdata,
  getnextleveluser,
}
