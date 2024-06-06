var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/temp_new')
const temp_new = mongoose.model('temp_new')

async function trashTemp(req) {
  try {
    let result = await temp_new.find({ trash: 'delete' })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function deletedocumentTemp(req) {
  try {
    let result = await temp_new.updateOne(
      { _id: req.body._id },
      {
        $set: {
          trash: 'delete',
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

async function deleteTemp(req) {
  try {
    let result = await temp_new.find()
    if (result) {
      // res.json(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function trashDataTemp(req) {
  try {
    var result = await temp_new.deleteOne({ _id: req.params.id }).exec()

    return result
  } catch (error) {
    throw error
  }
}
async function deletedocumentData(req) {
  try {
    let result = await temp_new.updateOne(
      { _id: req.body._id },
      {
        $set: {
          trash: 'delete',
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
async function restoredocumentTemp(req) {
  try {
    let result = await temp_new.updateOne(
      { _id: req.body._id },
      {
        $set: {
          trash: 'pending',
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
module.exports = {
  trashTemp,
  deletedocumentTemp,
  deleteTemp,
  trashDataTemp,
  deletedocumentData,
  restoredocumentTemp,
}
