var express = require('express')
const router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
let jwt = require('jsonwebtoken')
let verifyToken = require('../Controllers/verifyToken')
var mailsender = require('./sendMail')
const { required } = require('joi')
const { route } = require('./admin_routes.js')
const { result } = require('lodash')
var url = require('../config/service')

require('../models/new_document')
const add_document = mongoose.model('new_document')

require('../models/search')
const addsearch = mongoose.model('search')
require('../models/OTP')
const OTP = mongoose.model('OTP')

require('../models/Users')
const User = mongoose.model('Users')

require('../models/allrequest')
const request = mongoose.model('allrequest')

require('../models/new_document')
const document = mongoose.model('new_document')

require('../models/notification')
const notification = mongoose.model('notification')

require('../models/admin_number')
const admin_data = mongoose.model('admin_number')

require('../models/location')
const location = mongoose.model('location')

require('../models/add_docucomment')
const newcomment = mongoose.model('add_docucomment')

require('../models/file_size')
const filesize = mongoose.model('file_size')

require('../models/dateformat')
const formatdate = mongoose.model('dateformat')

router.post('/getrequest', async function (req, res) {
  let result = await request
    .find({ requested_id: req.body.requested_id })
    .populate('request_id')
  if (result) {
    res.send(result)
  }
})

router.post('/documentmail', async function (req, res) {
  let result = await User.findOne({ email: req.body.emailtag })
  if (result) {
    let data = await User.updateOne(
      { email: req.body.emailtag },
      {
        $push: {
          folderbase: {
            subkeyword: req.body.subkeyword,
            contentkeyword: req.body.contentkeyword,
          },
        },
      },
      {
        new: true,
      },
    )
    if (data) {
      res.send({ status: 200, text: data })
    }
  } else {
    res.send({ status: 400, text: 'this email id not register in this DDMS' })
  }
})

router.post('/checkopt', async function (req, res) {
  let result = await add_document.findOne({
    _id: req.body._id,
    file_otp: req.body.file_otp,
  })
  if (result) {
    res.send({ status: 200, data: result, error: false })
  } else {
    res.send({ status: 400, data: result, error: true })
  }
})

router.post('/addfilelock', async function (req, res) {
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
    res.send(result)
  }
})

router.post('/searchsave', async function (req, res) {
  let data = addsearch(req.body)
  let result = await data.save()
  if (result) {
    res.send(result)
  }
})

router.post('/deletereject', async function (req, res) {
  debugger
  let data = await add_document.deleteOne({ _id: req.body._id })
  if (data) {
    res.send(data)
  }
})

router.get('/getallsearch', async function (req, res) {
  let result = await addsearch.find()
  if (result) {
    res.send(result)
  }
})

router.post('/sendmail', async function (req, res) {
  mailsender.sendusermail(req.body, (info) => {
    console.log('the mail has been send and the id is  ${info.messageId}')
    res.send(info)
  })
  // res.send()
})

router.post('/finduserdata', async function (req, res) {
  let result = await User.findOne({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})

router.post('/documentlink', async function (req, res) {
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
  fs.readFile(template_url, async function read(err, bufcontent) {
    var content = (bufcontent || '').toString()
    let jwt_secret = 'mysecret'
    let token = jwt.sign({ id: req.body.selectuserid }, jwt_secret, {
      expiresIn: '1d',
    })

    // let token= jwt.sign({
    //     data: 'foobar'
    //   }, 'secret', { expiresIn: 60 * 60 });
    // let token = jwt.sign( jwt_secret, { expiresIn: '1d' });

    console.log(token)
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
    var mailObject = await mailsender.GetMailObject(
      req.body.email,
      'File Share',
      content,
      null,
      null,
    )
    mailsender.sendEmail(mailObject, function (mailres) {
      res.send({ status: 200, data: mailres })
    })
  })
})

router.post('/documentOTP', async function (req, res) {
  let minm = 100000
  let maxm = 999999
  let otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm
  req.body.otp = otp
  let data = new OTP(req.body)
  let result = await data.save()
  if (result) {
    res.send(result)
  }
  let template_url = 'assets/template/otp.html'
  fs.readFile(template_url, async function read(err, bufcontent) {
    var content = (bufcontent || '').toString()
    content = content.replace('$otp$', req.body.otp)
    var mailObject = await mailsender.GetMailObject(
      req.body.email,
      '  ',
      content,
      null,
      null,
    )
    mailsender.shareemail(mailObject, function (mailres) {
      res.send({ status: 200, data: mailres })
    })
  })
})
router.post('/verifyOTP/', async function (req, res) {
  try {
    var result = await OTP.aggregate([{ $match: { otp: req.body.otp } }])
    console.log(result)
    res.send(result)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.delete('/deleteotp/:id', async (req, res) => {
  try {
    var result = await OTP.deleteOne({ _id: req.params.id }).exec()
    res.send(result)
    console.log(result)
  } catch (error) {
    res.status(500).send(error)
  }
})
// let decodedtoken = '';
// let verifyToken = function(req, res, next) {
//     let token = req.query.token;
//     console.log(token)
//     jwt.verify(token, 'mysecret', (err, tokendata) => {
//         if(err){
//             return res.status(400).json({message: 'Unathorized request'});
//         }
//         if(tokendata){
//                 decodedtoken = tokendata;
//                 console.log(decodedtoken);
//                 next();
//         }
//     });
//  }
//  router.get('/documentlinkID', verifyToken , (req , res , next) => {
//     return res.send(res);
// });
router.get('/documentlinkID/:id', async (req, res) => {
  try {
    var adminLogin = await add_document.findById(req.params.id)
    return res.send(adminLogin)
  } catch (error) {
    res.status(500).send(error)
    //  console.log(adminLogin);
  }
})
router.get('/DeleteDocumentlink/:paramID', async (req, res) => {
  let result = await add_document.find({ _id: req.params.paramID })
  res.send(result)
})
router.patch('/DeleteDocumentlink/:paramID', async (req, res) => {
  console.log(req.body._id)
  let result = await add_document.updateOne(
    { _id: req.params.paramID },
    {
      $pull: { file_shear: { _id: req.body._id } },
    },
  )
  res.send(result)
})
router.patch('/DeleteDocumentlinkPermission/:paramID', async (req, res) => {
  let result = await add_document.updateOne(
    { _id: req.params.paramID },
    {
      $pull: { userPermission: { _id: req.body._id } },
    },
  )
  res.send(result)
})

router.post('/openeditdocument', async (req, res) => {})

router.post('/remoepreview', async function (req, res) {
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
    mailsender.approve(mailObject, async function (mailres) {
      const result = await request.remove({ _id: req.body._id })
      if (result) {
        res.send(result)
      }
    })
  })
})

// router.post('/openeditdocument', async function(req,res){
//     // var content =
//     fs.readFile(req.body.Uploaded_image, function(err,data){
//         if(err) throw err,
//         res.send()
//     })
// })

router.post('/approve', async function (req, res) {
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
    mailsender.approve(mailObject, async function (mailres) {
      let result = await document.updateOne(
        {
          _id: req.body.document_id,
          approve_preview: { $elemMatch: { request_id: req.body.request_id } },
        },
        {
          $set: {
            'approve_preview.$.preview_approve': req.body.approve_preview,
          },
        },
      )
      const data = await request.remove({ _id: req.body._id })
      if (result) {
        res.send(result)
      }
    })
  })
})

router.post('/requestapi', async function (req, res) {
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
      mailsender.downloadrequest(mailObject, async function (mailres) {
        let newrole = new request(req.body)
        let result = await newrole.save()
        if (result) {
          res.send({ status: 200, result: result })
        }
      })
    })
  } else {
    res.send({ status: 400, data: getresult })
  }
})

router.post('/addapprovellevel', async function (req, res) {
  let result = await document.updateOne(
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
    res.send(info)
  })
})

router.post('/sendnotification', async function (req, res) {
  let data = new notification(req.body)
  let result = await data.save()
  if (result) {
    res.send(result)
  }
})

router.post('/getnextleveluser', async function (req, res) {
  let result = await User.find({
    selectdeparament: req.body.selectdeparament,
    verfication_level: req.body.verfication,
  })
  if (result) {
    res.send({ data: result, status: 200 })
  } else {
    res.send({ data: 'no user found', status: 400 })
  }
})

router.post('/notification', async function (req, res) {
  let result = await notification
    .find({ reciver_id: { $elemMatch: { recive_id: req.body.reciver_id } } })
    .populate('reciver_id.sender_id')
    .sort({ $natural: -1 })
  let data = await notification.find({
    readBy: { $elemMatch: { read: req.body.reciver_id } },
  })
  if (result) {
    res.send({ result, data })
  }
})

router.post('/adduserid', async function (req, res) {
  let result = await notification.findOne({
    _id: req.body._id,
    readBy: { $elemMatch: { read: req.body.read } },
  })
  if (result) {
    res.send(result)
  } else {
    let data = await notification.updateOne(
      { _id: req.body._id },
      {
        $push: {
          readBy: {
            read: req.body.read,
          },
        },
      },
      {
        new: true,
      },
    )
    if (data) {
      res.send(data)
    }
  }
})

router.get('/getadminnumber', async function (req, res) {
  var result = await admin_data.find()
  if (result) {
    res.send(result)
  }
})

router.get('/getfilesize', async function (req, res) {
  var result = await filesize.findOne()
  if (result) {
    res.send(result)
  }
})

router.get('/getdateformat', async function (req, res) {
  var result = await formatdate.findOne()
  if (result) {
    res.send(result)
  }
})

router.get('/allrejected', async function (req, res) {
  var result = await document.find({ file_publish: 'reject' })
  if (result) {
    res.send(result)
  }
})

router.post('/updatehelp', async function (req, res) {
  if (req.body._id) {
    let url = await admin_data.updateOne(
      { _id: req.body._id },
      {
        $set: {
          adminemail: req.body.adminemail,
          adminnumber: req.body.adminnumber,
        },
      },
    )
    if (url) {
      res.send(url)
    }
  } else {
    let data = admin_data(req.body)
    let result = await data.save()
    if (result) {
      res.send(result)
    }
  }
})

router.post('/updatefilesize', async function (req, res) {
  if (req.body._id) {
    let url = await filesize.updateOne(
      { _id: req.body._id },
      {
        $set: {
          file_size: req.body.file_size,
        },
      },
    )
    if (url) {
      res.send(url)
    }
  } else {
    let data = filesize(req.body)
    let result = await data.save()
    if (result) {
      res.send(result)
    }
  }
})

router.post('/updatedateformat', async function (req, res) {
  if (req.body._id) {
    let url = await formatdate.updateOne(
      { _id: req.body._id },
      {
        $set: {
          formatdate: req.body.formatdate,
        },
      },
    )
    if (url) {
      res.send(url)
    }
  } else {
    let data = formatdate(req.body)
    let result = await data.save()
    if (result) {
      res.send(result)
    }
  }
})

router.post('/documentstatus', async function (req, res) {
  let result = await document
    .find({ approved_by: { $elemMatch: { user_id: req.body.user_id } } })
    .populate('login_id')
  if (result) {
    res.send(result)
  }
})

router.post('/idbasedata', async function (req, res) {
  let result = await document
    .find({ _id: req.body._id })
    .populate('file_shear.user_id login_id')
  if (result) {
    res.send(result)
  }
})

router.post('/savelocation', async function (req, res) {
  let data = await location.findOne({ location: req.body.location })
  if (data) {
    res.send({ status: 400 })
  } else {
    let locationdata = new location(req.body)
    let result = await locationdata.save()
    if (result) {
      res.send({ status: 200, data: result })
    }
  }
})

router.get('/alllocation', async function (req, res) {
  let result = await location.find()
  if (result) {
    res.send(result)
  }
})

router.post('/deletelocation', async function (req, res) {
  let result = await location.remove({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})

router.post('/addcomment', async function (req, res) {
  let data = newcomment(req.body)
  let result = await data.save()
  if (result) {
    res.send({ status: 200, data: result })
  } else {
    res.send({ status: 400 })
  }
})
router.delete('/addcomment/:id', async (req, res) => {
  try {
    var result = await newcomment.deleteOne({ _id: req.params.id }).exec()
    res.send(result)
    console.log(result)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.get('/addcomment', async (req, res) => {
  console.log("req.body")

  let comment = await newcomment.find()
  if (comment) {
    res.send({ data: comment })
  }
})

router.post('/commentupdate', async (req, res) => {
  let result = await newcomment.updateOne(
    { _id: req.body._id },
    {
      $set: {
        add_comment: req.body.add_comment,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

router.get('/getallcomment/:docs', async (req, res) => {
  let result = await newcomment
    .find({ document_id: req.params.docs })
    .populate('user_id document_id')
    .sort({ $natural: -1 })
  res.send(result)
})
router.get('/addcommentD/:userId/:docs', async (req, res) => {
  try {
    console.log('dasdad')
    let paramID = req.params.userId
    let document = req.params.docs
    let result = await newcomment
      .find({ document_id: document, user_id: paramID })
      .populate('user_id document_id')
      .sort({ $natural: -1 })
    // let document = req.body.document_id;
    // let document = '6021045fe7407a12fcb3d7b4';
    //   let result = await newcomment.aggregate([
    //     {$match:
    //         {user_id : new mongoose.Types.ObjectId(paramID), document_id: new mongoose.Types.ObjectId(document) }
    //      },
    //     {
    //       $lookup: {
    //         from: 'users',
    //         localField: 'user_id',
    //         foreignField: '_id',
    //         as: 'User'
    //       }
    //     },
    //     { $sort :{ _id : -1} },
    //   ]);
    res.send(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/allcomment', async function (req, res) {
  let comment = await newcomment
    .find({ document_id: req.body.document_id })
    .populate('user_id document_id')
  if (comment) {
    res.send({ data: comment })
  }
})

module.exports = router
