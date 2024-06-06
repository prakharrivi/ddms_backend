var mongoose = require('mongoose')

var dateformatSchema = mongoose.Schema({
  formatdate: {
    type: String,
  },

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('dateformat', dateformatSchema)
