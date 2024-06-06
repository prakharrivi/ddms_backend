var mongoose = require('mongoose')

var CompanylogoSchema = mongoose.Schema({
  company_logo: {
    type: String,
  },
  display_image: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

exports = mongoose.model('companylogo', CompanylogoSchema)
