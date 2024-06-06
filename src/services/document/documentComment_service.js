var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/add_docucomment')
const newcomment = mongoose.model('add_docucomment')

async function addcomment(req) {
  try {
    let data = newcomment(req.body)
    let result = await data.save()
    if (result) {
      return { status: 200, data: result }
    } else {
      return { status: 400 }
    }
  } catch (error) {
    throw error
  }
}
async function addcomments(req) {
  try {
    var result = await newcomment.deleteOne({ _id: req.params.id }).exec()

    return result
  } catch (error) {
    throw error
  }
}

async function getcomments(req) {
  try {
    let comment = await newcomment.find()
    if (comment) {
      return { data: comment }
    }
  } catch (error) {
    throw error
  }
}

async function commentupdate(req) {
  try {
    let result = await newcomment.updateOne(
      { _id: req.body._id },
      {
        $set: {
          add_comment: req.body.add_comment,
        },
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getallcomment(req) {
  try {
    let result = await newcomment
      .find({ document_id: req.params.docs })
      .populate('user_id document_id')
      .sort({ $natural: -1 })
    return result
  } catch (error) {
    throw error
  }
}

async function addcommentD(req) {
  try {
    let paramID = req.params.userId
    let document = req.params.docs
    let result = await newcomment
      .find({ document_id: document, user_id: paramID })
      .populate('user_id document_id')
      .sort({ $natural: -1 })

    return result
  } catch (error) {
    throw error
  }
}
async function allcomment(req) {
  try {
    let comment = await newcomment
      .find({ document_id: req.body.document_id })
      .populate('user_id document_id')
    if (comment) {
      return { data: comment }
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  addcomment,
  addcomments,
  getcomments,
  commentupdate,
  getallcomment,
  addcommentD,
  allcomment,
}
