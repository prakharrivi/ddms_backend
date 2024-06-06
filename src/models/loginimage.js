var mongoose = require('mongoose')

var LoginimageSchema = mongoose.Schema({
  Uploadimage: {
    type: String,
  },
  display_image: {
    type: Boolean,
    default: false,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('loginimage', LoginimageSchema)
