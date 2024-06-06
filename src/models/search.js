var mongoose = require('mongoose')

var searchSchema = mongoose.Schema({
  searchtext: {
    type: String,
  },
  author: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('search', searchSchema)
