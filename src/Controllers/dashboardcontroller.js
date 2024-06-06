var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
let jwt = require('jsonwebtoken')
var url = require('../config/service')
const auth = require('../middleware/auth')
// /middleware/auth
// var mailsender = require('./mailsend.js');
// var mailsender = require('./sendMail');
var zip = new require('node-zip')()
var bodyParser = require('body-parser')

var BreakdownReportService = require('../services/dashboardservice')
var Constant = require('../../src/Constant/Constant')

router.post('/superadmindata', auth, async function (req, res) {
  var response = {}
  BreakdownReportService.superadmindata(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/filecountbase', auth, async function (req, res) {
  BreakdownReportService.filecountbase(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/alldocument', auth, async function (req, res) {
  BreakdownReportService.alldocument(req)

    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getfolder', auth, async function (req, res) {
  BreakdownReportService.getfolder(req)

    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})
module.exports = router
