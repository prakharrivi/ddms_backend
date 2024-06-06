var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
let jwt = require('jsonwebtoken')
var url = require('../config/service')
// var mailsender = require('./mailsend.js');
// var mailsender = require('./sendMail');
var zip = new require('node-zip')()
var bodyParser = require('body-parser')

require('../models/add_folder')
const foldername = mongoose.model('add_folder')

require('../models/add_metadatagroup')
const metadatagroup = mongoose.model('add_metadatagroup')

require('../models/companylogo')
const companylogo = mongoose.model('companylogo')

require('../models/new_document')
const add_document = mongoose.model('new_document')
require('../models/temp_new')
const temp_new = mongoose.model('temp_new')

require('../models/user_role')
const user_role = mongoose.model('user_role')

require('../models/Users')
const User = mongoose.model('Users')

require('../models/add_cron')
const cron = mongoose.model('add_cron')

require('../models/file_type')
const filetype = mongoose.model('file_type')

require('../models/verfication-level')
const verfication = mongoose.model('verfication-level')

require('../models/loginimage')
const uploadimage = mongoose.model('loginimage')

// superadmindata

async function superadmindata(req) {
  // var response = [];
  try {
    let result = await add_document
      .find({ isFolder: req.body.folder, trash: 'pending' })
      .sort({ $natural: -1 })
      .limit(5)
    let data = await add_document
      .find({ isFolder: req.body.file, trash: 'pending', documentexpiry: true })
      .sort({ $natural: -1 })
      .limit(5)
    let user = await User.countDocuments()
    let file = await add_document.countDocuments({ isFolder: req.body.file })
    let department = await add_document.countDocuments({
      isFolder: req.body.file,
      created_at: {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
    })
    let month = await add_document.countDocuments({
      isFolder: req.body.file,
      created_at: {
        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
      },
    })
    return { result, data, user, file, department, month }
    // response.push(data);
  } catch (error) {
    throw error
  }
}

async function filecountbase(req) {
  try {
    let result = await add_document.aggregate([
      { $group: { _id: '$extension', count: { $sum: 1 } } },
    ])
    console.log('result')
    console.log(result)

    return result
  } catch (error) {
    throw error
  }
}

async function alldocument(req) {
  try {
    let result = await add_document.find({ isFolder: 'false' })
    return result
  } catch (error) {
    throw error
  }
}

async function getfolder(req) {
  try {
    let result = await add_document
      .find({
        isFolder: req.body.folder,
        trash: 'pending',
        selectdeparament: req.body.selectdeparament,
      })
      .sort({ $natural: -1 })
      .limit(5)
    let data = await add_document
      .find({
        isFolder: req.body.file,
        login_id: req.body._id,
        trash: 'pending',
        documentexpiry: true,
      })
      .sort({ $natural: -1 })
      .limit(5)
    let user = await User.countDocuments({
      selectdeparament: req.body.selectdeparament,
    })
    let file = await add_document.countDocuments({
      isFolder: req.body.file,
      selectdeparament: req.body.selectdeparament,
    })
    let department = await add_document.countDocuments({
      isFolder: req.body.file,
      selectdeparament: req.body.selectdeparament,
      created_at: {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
    })
    let month = await add_document.countDocuments({
      isFolder: req.body.file,
      selectdeparament: req.body.selectdeparament,
      created_at: {
        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
      },
    })
  } catch (error) {
    throw error
  }
}
module.exports = {
  superadmindata,
  filecountbase,
  alldocument,
  getfolder,
}
