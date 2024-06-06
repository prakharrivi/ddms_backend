var Joi = require('joi')
var async = require('async')
var mongoose = require('mongoose')
var md5 = require('md5')

const { UserModel } = require('../models/Users')

exports.user_login = async (req, res, next) => {
  let result = await UserModel.findOne({
    email: req.body.email,
    password: req.body.password,
  })
  if (result) {
    res.send({ status: 200, data: result })
  } else {
    res.send({ status: 400, text: 'your user name and password worng' })
  }
}
