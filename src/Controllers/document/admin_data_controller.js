var express = require('express')
var router = express.Router()
const auth = require('../../middleware/auth')
//  var mailsender = require('../../Routes/sendMail');
var bodyParser = require('body-parser')

var admin_dataService = require('../../services/document/admin_data_service')
var Constant = require('../../Constant/Constant')

router.post('/getadminnumber', async function (req, res) {
  admin_dataService
    .getadminnumber(req)
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

router.post('/updatehelp', async function (req, res) {
  admin_dataService
    .updatehelp(req)
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
