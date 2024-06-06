const boolean = require('joi/lib/types/boolean')
var mongoose = require('mongoose')

var UsersSchema = mongoose.Schema({
  First_name: {
    type: String,
  },
  Last_Name: {
    type: String,
  },
  email: {
    type: String,
  },

  isMailVerfication: {
    type: Boolean,
  },
  phone_Number: {
    type: Number,
  },
  password: {
    type: String,
  },
  userRole: {
    type: String,
  },
  Employee_id: {
    type: String,
  },
  uidnumber: {
    type: String,
  },
  name: {
    type: String,
  },
  active: {
    type: String,
  },
  notifyusers: {
    type: String,
  },
  user_image: {
    type: String,
  },
  user_profile: {
    type: String,
  },
  User_type: {
    type: String,
  },
  Allowmailintegration: {
    type: String,
  },
  Roles_id: {
    type: String,
  },

  con_number: {
    type: Number,
  },

  Asign_storage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manage_quota',
  },
  access_token: {
    type: String,
  },
  token: {
    type: String,
  },

  ip_address: {
    type: String,
  },
  workflow_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'work_flow',
  },
  created_at: { type: Date, default: Date.now },

  last_login_date: {
    type: Date,
    default: Date.now,
  },

  add_desgination: {
    type: String,
  },

  Otp: {
    type: Number,
  },
  selectdeparament: {
    type: String,
  },
  doc_url: {
    type: String,
  },

  verfication_level: {
    type: String,
  },

  login_time: [
    {
      newlogin_time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  folderbase: [
    {
      subkeyword: {
        type: String,
      },
      contentkeyword: {
        type: String,
      },
    },
  ],
})

module.exports = mongoose.model('Users', UsersSchema)
