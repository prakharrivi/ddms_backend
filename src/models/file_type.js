var mongoose = require('mongoose')

var file_typeSchema = mongoose.Schema({
  user_name: {
    type: String,
  },
  file_extenction: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('file_type', file_typeSchema)
