var mongoose = require('mongoose')

var documentexpirySchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'new_document',
  },
  expiry_date: {
    type: Date,
  },
  documentexpiry: {
    type: Boolean,
    default: false,
  },
  // prenotification: {
  //     type: String
  // },
  expirynotification: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('documentexpiry', documentexpirySchema)
