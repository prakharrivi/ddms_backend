var mongoose = require('mongoose')

var activite_logSchema = mongoose.Schema({
  active: {
    type: String,
    default: false,
  },
  mail: {
    type: String,
  },

  name: {
    type: String,
  },

  expression: {
    type: String,
  },

  file_type: {
    type: String,
  },

  file_name: {
    type: String,
  },

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('activite_log', activite_logSchema)
