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

var LicenseService = require('../services/license_service')
var Constant = require('../../src/Constant/Constant')

router.post('/addlicense', async function (req, res) {
  var response = {}
  LicenseService.addlicense(req)
    .then(function (data) {
      if (data && data[0] > 0) {
        // response = {
        //     respMessage: Constant.recordFetchedMassage,
        //     respCode: Constant.respCode200,
        //     totalRecord: data[0],
        //     data: data[1],
        // };
        res.send(data)
      } else {
        response = {
          respMessage: Constant.noRecordMessage,
          respCode: Constant.respCode204,
          totalRecord: data[0],
          data: data[1],
        }
      }
      res.status(200).send(response)
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
  // let new_metadata = metadatagroup(req.body)
  // let result = await new_metadata.save()
  // if (result) {
  //     res.send(result)
  // }
})

router.post('/getdomainbase', async function (req, res) {
  var response = {}
  LicenseService.getdomainbase(req)
    .then(function (data) {
      if (data && data[0] > 0) {
        // response = {
        //     respMessage: Constant.recordFetchedMassage,
        //     respCode: Constant.respCode200,
        //     totalRecord: data[0],
        //     data: data[1],
        // };
        res.send(data)
      } else {
        response = {
          respMessage: Constant.noRecordMessage,
          respCode: Constant.respCode204,
          totalRecord: data[0],
          data: data[1],
        }
      }
      res.status(200).send(response)
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getalldomain', async function (req, res) {
  var response = {}
  LicenseService.getalldomain(req)
    .then(function (data) {
      if (data && data[0] > 0) {
        // response = {
        //     respMessage: Constant.recordFetchedMassage,
        //     respCode: Constant.respCode200,
        //     totalRecord: data[0],
        //     data: data[1],
        // };
        res.send(data)
      } else {
        response = {
          respMessage: Constant.noRecordMessage,
          respCode: Constant.respCode204,
          totalRecord: data[0],
          data: data[1],
        }
      }
      res.status(200).send(response)
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/domainlogin', async function (req, res) {
  var response = {}
  LicenseService.domainlogin(req)
    .then(function (data) {
      if (data && data[0] > 0) {
        // response = {
        //     respMessage: Constant.recordFetchedMassage,
        //     respCode: Constant.respCode200,
        //     totalRecord: data[0],
        //     data: data[1],
        // };
        res.send(data)
      } else {
        response = {
          respMessage: Constant.noRecordMessage,
          respCode: Constant.respCode204,
          totalRecord: data[0],
          data: data[1],
        }
      }
      res.status(200).send(response)
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

module.exports = router
