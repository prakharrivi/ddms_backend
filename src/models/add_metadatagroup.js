var mongoose = require('mongoose')

var add_metadatagroupSchema = mongoose.Schema({
  Group_name: String,
  Add_row: [
    {
      field_name1: String,
      field_type1: String,
      fdd_option1: String,
      fdd_validation1: String,
    },
  ],
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('add_metadatagroup', add_metadatagroupSchema)
