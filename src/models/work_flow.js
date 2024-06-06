var mongoose = require('mongoose')

var work_flowSchema = mongoose.Schema({
  add_department: String,

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('work_flow', work_flowSchema)
