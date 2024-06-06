var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/notification')
const notification = mongoose.model('notification')

async function notifications(req) {
  try {
    let result = await notification
      .find({ reciver_id: { $elemMatch: { recive_id: req.body.reciver_id } } })
      .populate('reciver_id.sender_id')
      .sort({ $natural: -1 })
    let data = await notification.find({
      readBy: { $elemMatch: { read: req.body.reciver_id } },
    })
    if (result) {
      return { result, data }
    }
  } catch (error) {
    throw error
  }
}

async function adduserid(req) {
  try {
    let result = await notification.findOne({
      _id: req.body._id,
      readBy: { $elemMatch: { read: req.body.read } },
    })
    if (result) {
      // res.send(result)
      return result
    } else {
      let data = await notification.updateOne(
        { _id: req.body._id },
        {
          $push: {
            readBy: {
              read: req.body.read,
            },
          },
        },
        {
          new: true,
        },
      )
      if (data) {
        // res.send(data)
        return data
      }
    }
  } catch (error) {
    throw error
  }
}
async function sendnotification(req) {
  try {
    let data = new notification(req.body)
    let result = await data.save()
    if (result) {
      //   res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function sendmail(req) {
  try {
    mailsender.sendusermail(req.body, (info) => {
      console.log('the mail has been send and the id is  ${info.messageId}')
      // res.send(info)
    })
    return { status: 200 }
  } catch (error) {
    throw error
  }
}

module.exports = {
  notifications,
  adduserid,
  sendnotification,
  sendmail,
}
