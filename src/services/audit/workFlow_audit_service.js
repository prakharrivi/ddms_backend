var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/work_flow')
const work_flows = mongoose.model('work_flow')

async function getall(req) {
  try {
    let result = await work_flows.find({
      add_department: req.body.add_department,
    })
    // let data =  await
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function updatedepartment(req) {
  try {
    let result = await work_flows.updateOne(
      { _id: req.body._id },
      {
        $set: {
          add_department: req.body.add_department,
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
async function alldepartment(req) {
  try {
    let result = await work_flows.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function deletedeparment(req) {
  try {
    let result = await work_flows.remove({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function adddepartment(req) {
  try {
    let data = work_flows(req.body)
    let result = await data.save()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  getall,
  updatedepartment,
  alldepartment,
  deletedeparment,
  adddepartment,
}
