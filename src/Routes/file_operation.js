var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

require('../models/assign_document')
const asign = mongoose.model('assign_document')

require('../models/documentexpiry')
const expiry = mongoose.model('documentexpiry')

router.post('/workflow', async function (req, res) {
  let newworkflow = req.body
  newworkflow.task_id = Math.floor(1000 + Math.random() * 9000)
  let data = asign(newworkflow)
  let result = await data.save()
  if (result) {
    res.send({ status: 200, data: result })
  }
})

router.post('/allworkflow', async function (req, res) {
  let result = await asign
    .find({ document_id: req.body._id })
    .populate('asign_to asign_from document_id')
  if (result) {
    res.status(200).send({ data: result })
  }
})

router.get('/superadmincall', async function (req, res) {
  let result = await expiry
    .find({ documentexpiry: true })
    .populate('document_id')
  if (result.length > 0) {
    res.send({ status: 200, data: result, text: 'success' })
  } else {
    res.send({ status: 400, data: result, text: 'no file found' })
  }
})

router.post('/loginuserdata', async function (req, res) {
  let result = await expiry
    .find({ documentexpiry: true, user_id: req.body.userId })
    .populate('document_id')
  if (result.length > 0) {
    res.send({ status: 200, data: result, text: 'success' })
  } else {
    res.send({ status: 400, data: result, text: 'no file found' })
  }
})

module.exports = router
