var mongoose = require('mongoose')

var allrequestSchema = mongoose.Schema({
  requested_id: {
    type: String,
  },
  document_id: {
    type: String,
  },
  file_name: {
    type: String,
  },
  request_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('allrequest', allrequestSchema)
