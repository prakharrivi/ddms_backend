var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/allrequest')
const request = mongoose.model('allrequest')

require('../../models/new_document')
const document = mongoose.model('new_document')

async function getrequest(req) {
  try {
    let result = await request
      .find({ requested_id: req.body.requested_id })
      .populate('request_id')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function remoepreview(req) {
  try {
    let template_url = 'assets/template/approve.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      content = content
        .replace('$user$', req.body.name)
        .replace('$action$', req.body.action)
        .replace('$user_name$', req.body.login_user)
      var mailObject = await mailsender.GetMailObject(
        req.body.email,
        req.body.action,
        content,
        null,
        null,
      )
      mailsender.approve(mailObject, async function (mailres) {})
    })
    const result = await request.remove({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function approve(req) {
  try {
    let template_url = 'assets/template/approve.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      content = content
        .replace('$user$', req.body.name)
        .replace('$action$', req.body.action)
        .replace('$user_name$', req.body.login_user)
      var mailObject = await mailsender.GetMailObject(
        req.body.email,
        req.body.action,
        content,
        null,
        null,
      )
      mailsender.approve(mailObject, async function (mailres) {})
    })
    let result = await document.updateOne(
      {
        _id: req.body.document_id,
        approve_preview: { $elemMatch: { request_id: req.body.request_id } },
      },
      {
        $set: { 'approve_preview.$.preview_approve': req.body.approve_preview },
      },
    )
    const data = await request.remove({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function requestapi(req) {
  try {
    let getresult = await document.find(
      { _id: req.body.document_id },
      {
        approve_preview: {
          $elemMatch: {
            request_id: req.body.request_id,
          },
        },
      },
    )
    if (getresult[0].approve_preview.length == 0) {
      let save = await document.updateOne(
        { _id: req.body.document_id },
        {
          $push: {
            approve_preview: {
              request_id: req.body.request_id,
            },
          },
        },
        {
          new: true,
        },
      )
      let template_url = 'assets/template/download.html'
      fs.readFile(template_url, async function read(err, bufcontent) {
        var content = (bufcontent || '').toString()
        content = content
          .replace('$user$', req.body.name)
          .replace('$file_name$', req.body.file_name)
          .replace('$request_user$', req.body.request_name)
        var mailObject = await mailsender.GetMailObject(
          req.body.email,
          'Download',
          content,
          null,
          null,
        )
        mailsender.downloadrequest(mailObject, async function (mailres) {})
      })
      let newrole = new request(req.body)
      let result = await newrole.save()
      if (result) {
        // res.send({ status: 200, result: result })
        return { status: 200, result: result }
      }
    } else {
      return { status: 400, data: getresult }
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  getrequest,
  remoepreview,
  approve,
  requestapi,
}
