var mongoose = require('mongoose')

var licenseSchema = mongoose.Schema({
  user_name: {
    type: String,
  },

  email: {
    type: String,
  },
  password: {
    type: String,
  },
  domain_name: {
    type: String,
  },

  islogin: {
    type: Boolean,
    default: false,
  },

  website_name: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('license', licenseSchema)
