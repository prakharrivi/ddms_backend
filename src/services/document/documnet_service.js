var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/new_document')
const add_document = mongoose.model('new_document')

async function addfilelock(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          lock: req.body.lock,
          file_otp: req.body.file_otp,
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
async function deletereject(req) {
  try {
    let data = await add_document.deleteOne({ _id: req.body._id })
    if (data) {
      // res.send(data)
      return data
    }
  } catch (error) {
    throw error
  }
}

async function documentlink(req, callback) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $push: {
          file_shear: {
            user_id: req.body.selectuserid,
            file_permission: req.body.permission,
            parent: req.body.parent,
            email: req.body.email,
          },
        },
      },
      {
        new: true,
      },
    )
    req.body.url = url.fileurl + '/dashboard/explorer/' + req.body.parent
    let template_url = 'assets/template/fileshare.html'
    fs.readFile(template_url, (err, bufcontent) => {
      var content = (bufcontent || '').toString()
      let jwt_secret = 'mysecret'
      let token = jwt.sign({ id: req.body.selectuserid }, jwt_secret, {
        expiresIn: '1d',
      })

      content = content
        .replace('$user$', req.body.usename)
        .replace('$folderfilename$', req.body.Uploaded_image)

        .replace(
          '$url$',
          url.BASEURL +
            'auth/myfile/preview?' +
            'myfileData=' +
            token +
            '&XfsefFD=' +
            req.body._id +
            '&byperM56=' +
            req.body.email +
            '&byperM=' +
            req.body.permission,
        )

      // console.log('http://localhost:4200/auth/myfile/preview?' + 'myfileData=' + token + '&XfsefFD=' + req.body._id + '&byperM56=' + req.body.email + '&byperM=' + req.body.permission)
      var mailObject = mailsender.GetMailObject(
        req.body.email,
        'File Share',
        content,
        null,
        null,
      )
      mailsender.sendEmail(mailObject, (mailres) => {})
    })
    return { status: 200 }
  } catch (error) {
    throw error
  }
}

async function checkopt(req) {
  try {
    let result = await add_document.findOne({
      _id: req.body._id,
      file_otp: req.body.file_otp,
    })
    if (result) {
      return { status: 200, data: result, error: false }
    } else {
      return { status: 400, data: result, error: true }
    }
  } catch (error) {
    throw error
  }
}
async function documentlinkID(req) {
  try {
    var adminLogin = await add_document.findById(req.params.id)
    return { status: 200, data: adminLogin }
  } catch (error) {
    throw error
    //  console.log(adminLogin);
  }
}

async function DeleteDocumentlink(req) {
  try {
    console.log(req.body._id)
    let result = await add_document.updateOne(
      { _id: req.params.paramID },
      {
        $pull: { file_shear: { _id: req.body._id } },
      },
    )
    // res.send(result);
    return result
  } catch (error) {
    throw error
  }
}
async function DeleteDocumentlinkPermission(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.params.paramID },
      {
        $pull: { userPermission: { _id: req.body._id } },
      },
    )
    // res.send(result);
    return result
  } catch (error) {
    throw error
  }
}

async function allrejected(req) {
  try {
    var result = await add_document.find({ file_publish: 'reject' })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function documentstatus(req) {
  try {
    let result = await add_document
      .find({ approved_by: { $elemMatch: { user_id: req.body.user_id } } })
      .populate('login_id')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function idbasedata(req) {
  try {
    let result = await add_document
      .find({ _id: req.body._id })
      .populate('file_shear.user_id login_id')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addapprovellevel(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          verfication: req.body.verfication,
          verfication_level: req.body.verfication_level,
          send_approvel: req.body.send_approvel,
        },
      },
    )
    mailsender.sendmailnextlevel(req.body, (info) => {
      console.log('the mail has been send and the id is  ${info.messageId}')
      // res.send(info)
    })
    return { status: 200 }
  } catch (error) {
    throw error
  }
}
module.exports = {
  addfilelock,
  deletereject,
  documentlink,
  checkopt,
  documentlinkID,
  DeleteDocumentlink,
  DeleteDocumentlinkPermission,
  allrejected,
  documentstatus,
  idbasedata,
  addapprovellevel,
}
