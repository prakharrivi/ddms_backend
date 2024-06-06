var mongoose = require('mongoose')

var searchSchema = mongoose.Schema({
  otp: {
    type: Number,
  },
  email: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('OTP', searchSchema)
