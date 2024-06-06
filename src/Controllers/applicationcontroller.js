var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
let jwt = require('jsonwebtoken')
var url = require('../config/service')
const auth = require('../middleware/auth')
const config = process.env
const multer = require('multer')
var zip = new require('node-zip')()
var bodyParser = require('body-parser')

var ApplicationService = require('../services/applicationservice')
var Constant = require('../../src/Constant/Constant')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/mydrive/bglc')
  },
  filename: (req, file, cb) => {
    let length = 15,
      charset =
        'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      retVal = ''
    retVal2 = ''
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    for (let j = 0, n = charset.length; j < length; ++j) {
      retVal2 += charset.charAt(Math.floor(Math.random() * n))
    }
    let uniq = file.originalname.split('.')
    file.originalname = retVal + retVal2 + '.' + uniq[uniq.length - 1]
    cb(null, `${file.originalname}`)
  },
  path: (req, file, cb) => {
    cb(null, 'uploads/mydrive/bglc')
  },
})

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    req.user = decoded
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
  return next()
}

router.post('/register', async function (req, res) {
  ApplicationService.applicationregister(req)
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

router.post('/applicationlogin', async function (req, res) {
  ApplicationService.applicationlogin(req)
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
const uploads = multer({ storage: storage })

//  const myDrive = 'bglc'
router.post('/uploads', uploads.single('file'), async function (req, res) {
  ApplicationService.dmssdk(req)
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

router.post('/upload', uploads.any('file'), async function (req, res) {
  ApplicationService.dmssdk(req)
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

router.post('/details', async function (req, res) {
  ApplicationService.applicationfile(req)
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

router.post('/list', async function (req, res) {
  ApplicationService.applicationfolderfile(req)
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
//  applicationlogin
module.exports = router
