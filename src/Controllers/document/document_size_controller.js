var express = require('express')
var router = express.Router()
const auth = require('../../middleware/auth')
//  var mailsender = require('../../Routes/sendMail');
var bodyParser = require('body-parser')

var documentsizeService = require('../../services/document/document_size_service')
var Constant = require('../../Constant/Constant')

router.post('/updatefilesize', async function (req, res) {
  documentsizeService
    .updatefilesize(req)
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

router.get('/getfilesize', async function (req, res) {
  documentsizeService
    .getfilesize(req)
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
