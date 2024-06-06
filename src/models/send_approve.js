var mongoose = require('mongoose')

var send_approveSchema = mongoose.Schema({
  add_department: String,

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('send_approve', send_approveSchema)
