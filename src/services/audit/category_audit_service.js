var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/categories')
const categories_wise = mongoose.model('categories')

async function allcategories(req) {
  try {
    let result = await categories_wise.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function Catdelete(req) {
  try {
    let result = await categories_wise.remove({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function addcategories(req) {
  try {
    let data = categories_wise(req.body)
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
  allcategories,
  Catdelete,
  addcategories,
}
