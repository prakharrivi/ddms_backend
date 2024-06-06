var express = require('express')
var router = express.Router()
const auth = require('../../middleware/auth')
//  var mailsender = require('../../Routes/sendMail');
var bodyParser = require('body-parser')

var documentdateformetService = require('../../services/document/document_dateformet_service')
var Constant = require('../../Constant/Constant')

router.get('/getdateformat', async function (req, res) {
  documentdateformetService
    .getdateformat(req)
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

router.post('/updatedateformat', async function (req, res) {
  documentdateformetService
    .updatedateformat(req)
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
