var mongoose = require('mongoose')

var add_designationSchema = mongoose.Schema({
  add_department: {
    type: String,
  },

  add_desgination: {
    type: String,
  },

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('add_designation', add_designationSchema)
