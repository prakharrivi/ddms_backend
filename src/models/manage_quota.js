var mongoose = require('mongoose')

var manage_quotaSchema = mongoose.Schema({
  user_name: String,
  active: String,
  manage_quota: String,
  profile_type: String,
  manage_section: {
    categories: {
      type: Boolean,
      default: false,
    },

    templates: {
      type: Boolean,
      default: false,
    },
    mail: {
      type: Boolean,
      default: false,
    },

    Trash: {
      type: Boolean,
      default: false,
    },
  },
  manage_folder: {
    manage_folder: {
      type: Boolean,
      default: false,
    },
    add_document: {
      type: Boolean,
      default: false,
    },
    scanner: {
      type: Boolean,
      default: false,
    },
    properties: {
      type: Boolean,
      default: false,
    },
    security: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: Boolean,
      default: false,
    },
    group_check: {
      type: Boolean,
      default: false,
    },
    create_folderon_root: {
      type: Boolean,
      default: false,
    },
    copy_to_root: {
      type: Boolean,
      default: false,
    },
    move_to_root: {
      type: Boolean,
      default: false,
    },
    file_count: {
      type: Boolean,
      default: false,
    },
  },
  manage_common: {
    delete: {
      type: Boolean,
      default: false,
    },
    rename: {
      type: Boolean,
      default: false,
    },
    copy: {
      type: Boolean,
      default: false,
    },
    move: {
      type: Boolean,
      default: false,
    },
    add_notes: {
      type: Boolean,
      default: false,
    },
    remove_notes: {
      type: Boolean,
      default: false,
    },
    export: {
      type: Boolean,
      default: false,
    },
    add_subscription: {
      type: Boolean,
      default: false,
    },
    remove_subscription: {
      type: Boolean,
      default: false,
    },
  },
  manage_trash: {
    purge: {
      type: Boolean,
      default: false,
    },

    purge_trash: {
      type: Boolean,
      default: false,
    },
    restore: {
      type: Boolean,
      default: false,
    },
  },
  manage_mail: {
    properties: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Boolean,
      default: false,
    },
    security: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: Boolean,
      default: false,
    },
  },
  manage_document: {
    Download: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    Export_to_word: {
      type: Boolean,
      default: false,
    },
    Update_new_version: {
      type: Boolean,
      default: false,
    },
    Unlock: {
      type: Boolean,
      default: false,
    },
    Sign_document: {
      type: Boolean,
      default: false,
    },
    Download_pdf: {
      type: Boolean,
      default: false,
    },
    Send_document_as_attachment: {
      type: Boolean,
      default: false,
    },
    Security: {
      type: Boolean,
      default: false,
    },
    History: {
      type: Boolean,
      default: false,
    },
    Preview: {
      type: Boolean,
      default: false,
    },
    Audit_log: {
      type: Boolean,
      default: false,
    },
    Add_category: {
      type: Boolean,
      default: false,
    },
    Add_Keyword: {
      type: Boolean,
      default: false,
    },
    Start_Workflow: {
      type: Boolean,
      default: false,
    },
    Restore_Version: {
      type: Boolean,
      default: false,
    },
    Export_to_word: {
      type: Boolean,
      default: false,
    },
    Update: {
      type: Boolean,
      default: false,
    },
    Cancel_Edit: {
      type: Boolean,
      default: false,
    },
    Lock: {
      type: Boolean,
      default: false,
    },
    Create_link: {
      type: Boolean,
      default: false,
    },
    Send_document_as_link: {
      type: Boolean,
      default: false,
    },
    Properties: {
      type: Boolean,
      default: false,
    },
    Notes: {
      type: Boolean,
      default: false,
    },
    Version_downloads: {
      type: Boolean,
      default: false,
    },
    Print_Visible: {
      type: Boolean,
      default: false,
    },
    Workflow_log: {
      type: Boolean,
      default: false,
    },
    Remove_category: {
      type: Boolean,
      default: false,
    },
    Remove_Keyword: {
      type: Boolean,
      default: false,
    },
    Create_from_template: {
      type: Boolean,
      default: false,
    },
    Sign_document: {
      type: Boolean,
      default: false,
    },
    Export_to_excel: {
      type: Boolean,
      default: false,
    },
  },
  created_at: { type: Date, default: Date.now },
})

exports = mongoose.model('manage_quota', manage_quotaSchema)
