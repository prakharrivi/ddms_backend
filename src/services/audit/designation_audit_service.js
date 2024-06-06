var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/add_designation')
const designation = mongoose.model('add_designation')

async function adddesignation(req) {
  try {
    let user = await designation.findOne({
      add_desgination: req.body.add_desgination,
      add_department: req.body.add_department,
    })
    if (!user) {
      let data = designation(req.body)
      let result = await data.save()
      if (result) {
        return { result: result, status: 200 }
      }
    } else {
      return { status: 400 }
    }
  } catch (error) {
    throw error
  }
}

async function deletedesignation(req) {
  try {
    let result = await designation.remove({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getalldesignation(req) {
  try {
    let result = await designation.find({
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

async function updatedesgination(req) {
  try {
    let result = await designation.updateOne(
      { _id: req.body._id },
      {
        $set: {
          add_department: req.body.add_department,
          add_desgination: req.body.add_desgination,
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

async function deprarement(req) {
  try {
    let result = await designation.find({
      add_department: req.body.selectdeparament,
    })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  adddesignation,
  deletedesignation,
  getalldesignation,
  updatedesgination,
  deprarement,
}
