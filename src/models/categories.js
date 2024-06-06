var mongoose = require('mongoose')

var categoriesSchema = mongoose.Schema({
  folder_name: String,
  folder_id: String,
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('categories', categoriesSchema)
