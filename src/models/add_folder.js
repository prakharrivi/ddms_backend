var mongoose = require('mongoose')

var add_folderSchema = mongoose.Schema({
  folder_name: String,
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('add_folder', add_folderSchema)
