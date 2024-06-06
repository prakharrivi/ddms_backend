var mongoose = require('mongoose')

var assign_documentSchema = mongoose.Schema({
  task_name: {
    type: String,
  },
  asign_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },

  task_id: {
    type: Number,
  },
  asign_from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'new_document',
  },

  Comment: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
  end_date: {
    type: Date,
  },

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('assign_document', assign_documentSchema)
