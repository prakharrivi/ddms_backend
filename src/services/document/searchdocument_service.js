var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/search')
const addsearch = mongoose.model('search')

async function getallsearch(req) {
  try {
    let result = await addsearch.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function searchsave(req) {
  try {
    let data = addsearch(req.body)
    let result = await data.save()
    if (result) {
      // res.send(result)\
      return result
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getallsearch,
  searchsave,
}
