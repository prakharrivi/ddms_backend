var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/location')
const location = mongoose.model('location')

async function savelocation(req) {
  try {
    let data = await location.findOne({ location: req.body.location })
    if (data) {
      // res.send({ status: 400 })
      return { status: 400 }
    } else {
      let locationdata = new location(req.body)
      let result = await locationdata.save()
      if (result) {
        // res.send({ status: 200, data: result })
        return { status: 200, data: result }
      }
    }
  } catch (error) {
    throw error
  }
}

async function alllocation(req) {
  try {
    let result = await location.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function deletelocation(req) {
  try {
    let result = await location.remove({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  savelocation,
  alllocation,
  deletelocation,
}
