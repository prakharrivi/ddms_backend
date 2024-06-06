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

require('../../models/new_document')
const add_document = mongoose.model('new_document')

require('../../models/file_type')
const filetype = mongoose.model('file_type')

require('../../models/user_role')
const role = mongoose.model('user_role')

async function getalluser(req) {
  try {
    let result = await User.find()
    let data = await role.find()
    if (result) {
      return { result, data }
    }
  } catch (error) {
    throw error
  }
}
async function datebasedata(req) {
  try {
    if (req.body.select == 'Log In') {
      let data = await User.find({
        last_login_date: { $gte: req.body.startDate, $lte: req.body.endDate },
      })
      if (data) {
        // res.send(data)
        return data
      }
    } else if (req.body.select == 'Uploaded File') {
      let data = await add_document.find({
        created_at: { $gte: req.body.startDate, $lte: req.body.endDate },
        isFolder: 'false',
      })
      if (data) {
        return data
        // res.send(data)
      }
    } else if (req.body.select == 'Upload Folder') {
      let data = await add_document.find({
        created_at: { $gte: req.body.startDate, $lte: req.body.endDate },
        isFolder: 'true',
      })
      if (data) {
        // res.send(data)
        return data
      }
    } else if (req.body.select == 'File Type') {
      let data = await filetype.find({
        created_at: { $gte: req.body.startDate, $lte: req.body.endDate },
      })
      if (data) {
        // res.send(data)
        return data
      }
    }
  } catch (error) {
    throw error
  }
}

async function getuser(req) {
  try {
    let result = await User.find({
      selectdeparament: req.body.add_department,
      add_desgination: req.body.add_desgination,
    })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addverfication(req) {
  try {
    let data = verfication(req.body)
    let user = await data.save()
    let userdata = await User.updateOne(
      { _id: req.body.user_name },
      {
        $set: {
          verfication_level: req.body.verfication_level,
        },
      },
    )
    if (user) {
      // res.send(user)
      return user
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getalluser,
  datebasedata,
  getuser,
  addverfication,
}
