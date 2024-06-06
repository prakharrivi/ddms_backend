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

async function managesection(req) {
  try {
    let result = await manage_quota.updateOne(
      { _id: req.body._id },
      {
        $set: {
          manage_section: req.body.data,
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

async function managdocument(req) {
  try {
    let result = await manage_quota.updateOne(
      { _id: req.body._id },
      {
        $set: {
          manage_document: req.body.data,
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

async function managemail(req) {
  try {
    let result = await manage_quota.updateOne(
      { _id: req.body._id },
      {
        $set: {
          manage_mail: req.body.data,
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

async function managecommon(req) {
  try {
    let result = await manage_quota.updateOne(
      { _id: req.body._id },
      {
        $set: {
          manage_common: req.body.data,
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

async function managefolder(req) {
  try {
    let result = await manage_quota.updateOne(
      { _id: req.body._id },
      {
        $set: {
          manage_folder: req.body.data,
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
  managesection,
  managdocument,
  managemail,
  managecommon,
  managefolder,
}
