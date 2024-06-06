var mongoose = require('mongoose')

var admin_numberSchema = mongoose.Schema({
  adminemail: {
    type: String,
  },
  adminnumber: {
    type: String,
  },

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('admin_number', admin_numberSchema)
