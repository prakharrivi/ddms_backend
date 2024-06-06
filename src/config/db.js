var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')
require('dotenv').config()
var config = require('./service')
var url = process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  function () {
    console.log('Database connected successfully')
  },
  function (err) {
    console.log(err)
  },
)
