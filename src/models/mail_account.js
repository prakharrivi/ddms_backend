var mongoose = require('mongoose')

var mail_accountSchema = mongoose.Schema({
  mail_protocol: String,
  mail_host: String,
  mail_user: String,
  mail_password: String,
  mail_folder: String,
  mail_mark: String,
  mail_delete: String,
  Active: String,
})

exports = mongoose.model('mail_account', mail_accountSchema)
