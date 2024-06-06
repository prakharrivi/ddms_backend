var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../Routes/sendMail')
var url = require('../config/service')
require('dotenv').config()

var fs = require('fs')

require('../models/assign_document')
const asign = mongoose.model('assign_document')

require('../models/documentexpiry')
const expiry = mongoose.model('documentexpiry')

async function workflow(req) {
  try {
    let newworkflow = req.body
    newworkflow.task_id = Math.floor(1000 + Math.random() * 9000)
    let data = asign(newworkflow)
    let result = await data.save()
    if (result) {
      return { status: 200, data: result }
    }
  } catch (error) {
    throw error
  }
}

async function allworkflow(req) {
  try {
    let result = await asign
      .find({ document_id: req.body._id })
      .populate('asign_to asign_from document_id')
    if (result) {
      return { status: 200, data: result }
    }
  } catch (error) {
    throw error
  }
}
async function superadmincall(req) {
  try {
    let result = await expiry
      .find({ documentexpiry: true })
      .populate('document_id')
    if (result.length > 0) {
      return { status: 200, data: result, text: 'success' }
    } else {
      return { status: 400, data: result, text: 'no file found' }
    }
  } catch (error) {
    throw error
  }
}

async function loginuserdata(req) {
  try {
    let result = await expiry
      .find({ documentexpiry: true, user_id: req.body.userId })
      .populate('document_id')
    if (result.length > 0) {
      return { status: 200, data: result, text: 'success' }
    } else {
      return { status: 400, data: result, text: 'no file found' }
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  workflow,
  allworkflow,
  superadmincall,
  loginuserdata,
}
