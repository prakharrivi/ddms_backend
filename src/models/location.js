var mongoose = require('mongoose')

var locationSchema = mongoose.Schema({
  location: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('location', locationSchema)
