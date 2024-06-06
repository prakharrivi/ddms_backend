var mongoose = require('mongoose')

var verfication_levelSchema = mongoose.Schema({
  add_department: String,
  add_desgination: String,
  user_name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  verfication_level: Number,

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('verfication-level', verfication_levelSchema)
