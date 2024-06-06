var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
// var mailsender = require('./mailsend.js');
var mailsender = require('./sendMail')
var fs = require('fs')

//  get all data base modal

require('../models/license')
const license = mongoose.model('license')

router.post('/addlicense', async function (req, res) {
  let result = await license.findOne({
    domain_name: req.body.domain_name,
    website_name: req.body.website_name,
  })
  if (result) {
    res.send({
      status: 400,
      data: 'this domain name and website name allready exit',
    })
  } else {
    req.body.password = Math.random().toString(36).substring(1)
    var a = Math.floor(1000 + Math.random() * 9000)
    var b = Math.floor(1000 + Math.random() * 9000)
    var c = Math.floor(1000 + Math.random() * 9000)
    var d = Math.floor(1000 + Math.random() * 9000)
    req.body.key = a + '-' + b + '-' + c + '-' + d
    let domaindata = new license(req.body)
    let value = await domaindata.save()
    let template_url = 'assets/template/newdomain.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      content = content
        .replace('$user$', req.body.user_name)
        .replace('$website_name$', req.body.website_name)
        .replace('$password$', req.body.password)
        .replace('$key$', req.body.key)
      var mailObject = await mailsender.GetMailObject(
        req.body.email,
        'File Share',
        content,
        null,
        null,
      )
      console.log(mailObject, 'mailObject')

      mailsender.sendEmail(mailObject, function (mailres) {
        res.send({ status: 200, data: value, infodata: mailres })
      })
    })
    // mailsender.newdomainmail(req.body, info => {
    //     console.log('the mail has been send and the id is  ${info.messageId}')
    //     res.send({status : 200 , data: value, infrom : info})
    // })
  }
})

router.post('/getdomainbase', async function (req, res) {
  let result = await license.findOne({
    domain_name: req.body.domain_name,
    islogin: true,
  })
  if (result) {
    res.send({ data: result, status: 200 })
  } else {
    res.send({ status: 400 })
  }
})

router.get('/getalldomain', async function (req, res) {
  let result = await license.find()
  if (result) {
    res.send(result)
  }
})

router.post('/domainlogin', async function (req, res) {
  let result = await license.findOne({
    user_name: req.body.username,
    password: req.body.password,
    domain_name: req.body.domain_name,
    website_name: req.body.website_name,
  })

  if (result) {
    let data = await license.updateOne(
      { domain_name: req.body.domain_name },
      {
        $set: {
          islogin: true,
        },
      },
    )
    res.send({ status: 200 })
  } else {
    res.send({ status: 400 })
  }
})

module.exports = router
