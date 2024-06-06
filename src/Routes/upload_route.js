var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
// var mailsender = require('./mailsend.js');
var mailsender = require('./sendMail')
var fs = require('fs')

module.exports = router
