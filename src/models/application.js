var mongoose = require('mongoose')
const { string, number } = require('joi')

var new_documentSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },

  contact_num: {
    type: String,
  },
  app_secret_key: {
    type: String,
  },
  app_merchent_key: {
    type: String,
  },
})

exports = mongoose.model('application', new_documentSchema)
