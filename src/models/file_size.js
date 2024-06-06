var mongoose = require('mongoose')

var file_sizeSchema = mongoose.Schema({
  file_size: {
    type: Number,
  },

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('file_size', file_sizeSchema)
