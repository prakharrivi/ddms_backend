var express = require('express')
var router = express.Router()
const auth = require('../../middleware/auth')
//  var mailsender = require('../../Routes/sendMail');
var bodyParser = require('body-parser')

var searchdocumentService = require('../../services/document/searchdocument_service')
var Constant = require('../../Constant/Constant')

router.get('/getallsearch', async function (req, res) {
  searchdocumentService
    .getallsearch(req)
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

router.post('/searchsave', async function (req, res) {
  searchdocumentService
    .searchsave(req)
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
