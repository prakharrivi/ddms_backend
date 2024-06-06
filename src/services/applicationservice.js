var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../Routes/sendMail')
var url = require('../config/service')
var crypto = require('crypto')
var path = require('path')
require('dotenv').config()
var FormData = require('form-data')
const multer = require('multer')

var fs = require('fs')
const { result } = require('lodash')

require('../models/application')
const application = mongoose.model('application')

require('../models/application_document')
const application_document = mongoose.model('application_document')

async function applicationregister(req) {
  try {
    let newworkflow = req.body
    var id = crypto.randomBytes(20).toString('hex')
    const merchent = Math.floor(100000 + Math.random() * 900000000)
    req.body.app_secret_key = id
    req.body.app_merchent_key = merchent

    let template_url = 'assets/template/approve.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      content = content
        .replace('$user$', req.body.name)
        .replace('$action$', req.body.email)
        .replace('$user_name$', req.body.app_secret_key)
      var mailObject = await mailsender.GetMailObject(
        req.body.email,
        req.body.name,
        content,
        null,
        null,
      )
      mailsender.sendEmail(mailObject, async function (mailres) {})
    })

    let data = application(newworkflow)
    let result = await data.save()

    var checkPath = path.join(
      __dirname,
      '../../uploads/mydrive/' + req.body.name,
    )
    fs.mkdirSync(checkPath, 0744)

    let obj = {
      company_name: req.body.name,
      Uploaded_filename: req.body.name,
      isFolder: true,
      file_path: 'Path :/mydrive/' + req.body.name,
      app_secret_key: id,
      app_merchent_key: merchent,
    }

    let new_folder = new application_document(obj)
    let folder = new_folder.save()

    if (result) {
      return { status: 200, data: result, folder: folder }
    }
  } catch (error) {
    throw error
  }
}

async function applicationlogin(req) {
  try {
    var person = await application
      .findOne({
        app_secret_key: req.body.app_secret_key,
        app_merchent_key: req.body.app_merchent_key,
      })
      .exec()

    if (person) {
      person.token = jwt.sign(
        { user_id: person._id, email: person.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        },
      )

      const decoded = jwt.verify(person.token, process.env.TOKEN_KEY)

      return { status: 200, data: person, token: person.token }
    }
  } catch (error) {
    throw error
  }
}

async function dmssdkp(req) {
  try {
    if (
      req.body.company_name &&
      req.body.app_secret_key &&
      req.body.app_merchent_key &&
      req.body.file_title
    ) {
      console.log(req.file, 'req.file')
      req.body.company_email = req.body.company_email
      var staticPath = 'drive/'
      var file_path = 'Path :/mydrive/' + req.body.company_name

      var checkPath = path.join(
        __dirname,
        '../../uploads/mydrive/' + req.body.company_name,
      )

      req.body.full_path = checkPath

      if (!fs.existsSync(checkPath)) {
        fs.mkdirSync(checkPath, 0744)
      }

      var person = await application_document
        .findOne({
          company_name: req.body.company_name,
          isFolder: 'true',
          app_secret_key: req.body.app_secret_key,
          app_merchent_key: req.body.app_merchent_key,
        })
        .exec()

      if (person) {
        req.body.parent = person._id
        req.body.isFolder = false
        req.body.file_path = file_path
        var extension = req.file.originalname.split('.').pop()
        var docPath =
          staticPath + req.body.company_name + '/' + req.file.filename
        let docUrl = docPath
        console.log(req.file)
        req.body.doc_url = docUrl
        req.body.extension = extension
        req.body.file_name = req.file.originalname

        let new_document = application_document(req.body)
        let result = await new_document.save()
        return {
          status: 200,
          data: req.body.file_title + ' sucessfully uploaded',
          url: process.env.MY_DRIVE_URL + req.file.originalname,
        }
      }
    } else {
      if (req.body.file_title == null) {
        return {
          status: 403,
          message: 'File Title Required',
        }
      } else if (req.body.app_secret_key == null) {
        return {
          status: 403,
          message: 'Secret Key Required',
        }
      } else if (req.body.app_merchent_key == null) {
        return {
          status: 403,
          message: 'Merchent Key Required',
        }
      } else if (req.body.company_name == null) {
        return {
          status: 403,
          message: 'Company Name Required',
        }
      } else {
        return {
          status: 403,
          message: 'Validation Failed',
        }
      }
    }
  } catch (error) {
    throw error
  }
}

async function dmssdk(req) {
  try {
    var url = []
    if (
      req.body.company_name &&
      req.body.app_secret_key &&
      req.body.app_merchent_key &&
      req.body.file_title
    ) {
      console.log(req.files, 'req.file')
      req.body.company_email = req.body.company_email
      var staticPath = 'drive/'
      var file_path = 'Path :/mydrive/' + req.body.company_name

      var checkPath = path.join(
        __dirname,
        '../../uploads/mydrive/' + req.body.company_name,
      )

      req.body.full_path = checkPath

      if (!fs.existsSync(checkPath)) {
        fs.mkdirSync(checkPath, 0744)
      }

      var person = await application_document
        .findOne({
          company_name: req.body.company_name,
          isFolder: 'true',
          app_secret_key: req.body.app_secret_key,
          app_merchent_key: req.body.app_merchent_key,
        })
        .exec()

      if (person) {
        req.body.parent = person._id
        req.body.isFolder = false
        req.body.file_path = file_path

        req.files.forEach((element) => {
          var extension = element.originalname.split('.').pop()
          var docPath =
            staticPath + req.body.company_name + '/' + element.filename
          let docUrl = docPath

          req.body.file_name = element.originalname

          req.body.doc_url = docUrl
          req.body.extension = extension
          let new_document = application_document(req.body)
          let result = new_document.save()

          url.push(process.env.MY_DRIVE_URL + element.originalname)
        })

        return {
          status: 200,
          data: req.body.file_title + ' sucessfully uploaded',
          url: url,
        }
      }
    } else {
      if (req.body.file_title == null) {
        return {
          status: 403,
          message: 'File Title Required',
        }
      } else if (req.body.app_secret_key == null) {
        return {
          status: 403,
          message: 'Secret Key Required',
        }
      } else if (req.body.app_merchent_key == null) {
        return {
          status: 403,
          message: 'Merchent Key Required',
        }
      } else if (req.body.company_name == null) {
        return {
          status: 403,
          message: 'Company Name Required',
        }
      } else {
        return {
          status: 403,
          message: 'Validation Failed',
        }
      }
    }
  } catch (error) {
    throw error
  }
}

async function applicationfile(req) {
  try {
    var person = await application_document
      .findOne({
        _id: { $eq: req.body.id },
        app_secret_key: { $eq: req.body.app_secret_key },
      })
      .exec()

    if (person) {
      var result = {
        _id: person._id,
        file_title: person.file_title,
        isFolder: person.isFolder,
        file_path: person.file_path,
        doc_url: process.env.BASE_URL + person.doc_url,

        extension: person.extension,
        created_at: person.created_at,
      }

      return result
    } else {
      return {
        status: 204,
        data: 'NO Data',
      }
    }
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

async function applicationfolderfile(req) {
  try {
    var person = await application_document
      .find(
        {
          isFolder: { $eq: false },
          app_secret_key: { $eq: req.body.app_secret_key },
        },
        {
          _id: 1,
          file_title: 1,
          isFolder: 1,
          file_path: 1,
          doc_url: 1,
          extension: 1,
          created_at: 1,
        },
      )
      .exec()

    person.forEach((element, index) => {
      person[index].doc_url = process.env.BASE_URL + element.doc_url
    })
    return person
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}
module.exports = {
  applicationregister,
  applicationlogin,
  dmssdk,
  applicationfile,
  applicationfolderfile,
}
