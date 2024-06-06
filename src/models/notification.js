var mongoose = require('mongoose')

var notificationSchema = mongoose.Schema({
  reciver_id: [
    {
      recive_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },

      text: {
        type: String,
      },

      sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    },
  ],

  readBy: [
    {
      read: {
        type: String,
      },
    },
  ],

  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('notification', notificationSchema)
