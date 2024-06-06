var mongoose = require('mongoose')
const { string, number } = require('joi')

var temp_new = mongoose.Schema({
  Uploaded_filename: {
    type: String,
  },
  file_publish: {
    type: String,
    default: 'pending',
  },

  file_path: {
    type: String,
  },

  file_expired: {
    default: Boolean,
    default: false,
  },

  trash: {
    type: String,
    default: 'pending',
  },
  send_approvel: {
    type: Boolean,
    default: false,
  },

  file_shear: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
      file_permission: {
        type: String,
      },
      email: {
        type: String,
      },
      parent: {
        type: String,
      },
    },
  ],
  userPermission: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  ],
  selectdeparament: {
    type: String,
  },
  approve_preview: [
    {
      request_id: {
        type: String,
      },
      preview_approve: {
        type: Boolean,
        default: false,
      },
    },
  ],

  extension: {
    type: String,
  },
  doc_url: {
    type: String,
  },
  user_name: {
    type: String,
  },
  document_version: {
    type: String,
  },
  filecount: {
    type: String,
  },
  lock: {
    type: Boolean,
    default: false,
  },
  totalusesize: {
    type: String,
  },
  document_notes: {
    type: String,
  },
  file_size: {
    type: String,
  },
  categories_id: {
    type: String,
  },
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  approve_level: {
    type: String,
  },
  reject_by: {
    type: String,
  },
  verfication: {
    type: String,
  },
  approved_by: [
    {
      add_comment: {
        type: String,
      },

      status: {
        type: String,
      },

      verficatied_level: {
        type: String,
      },
      verfied_by: {
        type: String,
      },
      user_id: {
        type: String,
      },
      verfied_User: {
        type: String,
      },
      created_at: { type: Date, default: Date.now },
    },
  ],

  add_review: [
    {
      add_task: {
        type: String,
      },
      assign_by: {
        type: String,
      },
      assign_user: {
        type: String,
      },
      assign_role: {
        type: String,
      },
      seleectread: {
        type: Boolean,
      },
      selectwrite: {
        type: Boolean,
      },
      selectnotification: {
        type: Boolean,
      },
      selectapprove: {
        type: Boolean,
      },
      selectreject: {
        type: Boolean,
      },
      file_name: {
        type: String,
      },
      review_type: {
        type: String,
      },
      aprove_status: {
        type: String,
        default: 'pending',
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      comment: {
        type: String,
      },
      updated_date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  version_contral: [
    {
      document_url: {
        type: String,
      },
      version: {
        type: Number,
      },
      add_notes: {
        type: String,
      },
      fileName: {
        type: String,
      },
      user_name: {
        type: String,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  verfication_level: {
    type: String,
  },
  Uploaded_image: {
    type: String,
  },
  parent: {
    type: String,
  },
  isFolder: {
    type: String,
  },
  add_keyword: [
    {
      addkeyword: String,
    },
  ],

  add_categorie: [
    {
      addkeyword: String,
    },
  ],
  notes: [
    {
      add_notes: {
        type: String,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      user_name: {
        type: String,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
})

exports = mongoose.model('temp_new', temp_new)
