var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/verfication-level')
const verfication = mongoose.model('verfication-level')

async function getverfication(req) {
  try {
    let result = await verfication.find({
      add_department: req.body.add_department,
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

async function getallverfication(req) {
  try {
    let result = await verfication
      .find({ add_department: req.body.add_department })
      .populate('user_name')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function updateverficationlevel(req) {
  try {
    let result = await verfication.updateOne(
      { _id: req.body._id },
      {
        $set: {
          add_department: req.body.add_department,
          add_desgination: req.body.add_desgination,
          verfication_level: req.body.verfication_level,
          user_name: req.body.user_name,
        },
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
async function deleteverfication(req) {
  try {
    let data = await verfication.remove({ _id: req.body._id })
    if (data) {
      // res.send(data)
      return data
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  getverfication,
  addverfication,
  getallverfication,
  updateverficationlevel,
  deleteverfication,
}
