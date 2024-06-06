var mongoose = require('mongoose')

var add_docucommentSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'new_document',
  },
  add_comment: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('add_docucomment', add_docucommentSchema)
