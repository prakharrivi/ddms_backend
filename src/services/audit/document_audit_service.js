var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/new_document')
const add_document = mongoose.model('new_document')
require('../../models/file_type')
const filetype = mongoose.model('file_type')
require('../../models/documentexpiry')
const expiry_date = mongoose.model('documentexpiry')
require('../../models/categories')
const categories_wise = mongoose.model('categories')

async function userdocument(req) {
  try {
    let result = await add_document
      .find({
        login_id: req.body._id,
        isFolder: req.body.file,
        trash: 'pending',
      })
      .populate('login_id')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function trash(req) {
  try {
    let result = await add_document.find({ trash: 'delete' })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function deletedocument(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          trash: 'delete',
        },
      },
    )
    if (result) {
      console.log(result, 'result')
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function trashData(req) {
  try {
    var result = await add_document.deleteOne({ _id: req.params.id }).exec()
    // res.send(result);
    return result
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

async function restoredocument(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          trash: 'pending',
        },
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function approvedocument(req) {
  try {
    let result = await add_document
      .find({
        verfication: req.body.verfication_level,
        isFolder: 'false',
        selectdeparament: req.body.selectdeparament,
      })
      .populate('login_id')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updateverfication(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $push: {
          approved_by: {
            add_comment: req.body.add_comment,
            status: req.body.status,
            user_id: req.body.user_id,
            verficatied_level: req.body.verficatied_level,
            verfied_by: req.body.verfied_by,
            verfied_User: req.body.verfied_User,
          },
        },
      },
      {
        new: true,
      },
    )
    let template_url = 'assets/template/fileshare.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      let jwt_secret = 'mysecret'
      let token = jwt.sign({ id: req.body.selectuserid }, jwt_secret, {
        expiresIn: '1d',
      })
      content = content
        .replace('$user$', req.body.verfied_User)
        .replace('$folderfilename$', req.body.verfied_by)

        .replace(
          '$url$',
          url.BASEURL +
            'auth/myfile/preview?' +
            'myfileData=' +
            token +
            '&XfsefFD=' +
            req.body._id +
            '&byperM56=' +
            req.body.email +
            '&byperM=' +
            req.body.permission,
        )
      var mailObject = await mailsender.GetMailObject(
        req.body.email,
        'Folder Share',
        content,
        null,
        null,
      )
      mailsender.sendEmail(mailObject, async function (mailres) {
        // res.send(result);
      })
    })
    return result
  } catch (error) {
    throw error
  }
}

async function reject(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          approve_level: req.body.approve_level,
          reject_by: req.body.reject_by,
          file_publish: req.body.file_publish,
        },
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function nextlevel(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          verfication: req.body.verfication,
          approve_level: req.body.approve_level,
          reject_by: req.body.reject_by,
          file_publish: req.body.file_publish || 'pending',
        },
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function document(req) {
  try {
    let result = await add_document
      .find({ isFolder: 'false' })
      .populate('login_id')
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updatefoldername(req) {
  try {
    let data = await categories_wise.findOne({
      folder_name: req.body.folder_name,
    })

    if (data) {
      return { status: 400, text: 'this folder name all ready exit' }
    } else {
      let result = await categories_wise.updateOne(
        { _id: req.body._id },
        {
          $set: {
            folder_name: req.body.folder_name,
          },
        },
      )
      console.log(result, 'result')
      if (result) {
        return {
          status: 200,
          data: result,
        }
      } else {
        return {
          status: 400,
        }
      }
    }
  } catch (error) {
    throw error
  }
}

async function foldernameupdate(req) {
  try {
    let data = await add_document.findOne({
      folder_name: req.body.Uploaded_filename,
    })
    console.log(req.body.Uploaded_filename, 'data')
    if (data) {
      return { status: 400, text: 'this folder name all ready exit' }
    } else {
      let result = await add_document.updateOne(
        { _id: req.body._id },
        {
          $set: {
            Uploaded_filename: req.body.Uploaded_filename,
          },
        },
      )
      console.log(result, 'result update foledr')
      if (result) {
        return {
          status: 200,
          data: result,
        }
      } else {
        return {
          status: 400,
        }
      }
    }
  } catch (error) {
    throw error
  }
}

async function idbasedata(req) {
  try {
    let result = await add_document.find({ categories_id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    } else {
      // res.send(result)
      return {
        status: 204,
      }
    }
  } catch (error) {
    throw error
  }
}

async function keyworddelete(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body.obj },
      { $pull: { add_keyword: { _id: req.body.addkeyword } } },
      { multi: true },
    )
    if (result) {
      // res.send(result)'
      return result
    }
  } catch (error) {
    throw error
  }
}

async function categoriedelete(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      { $pull: { add_categorie: { _id: req.body.categories_id } } },
      { multi: true },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addreview(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          add_review: req.body.review,
        },
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function alldocument(req) {
  try {
    let result = await add_document.find({ isFolder: 'false' })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function keyword(req) {
  try {
    let result = await add_document.findOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function Expirydocument(req) {
  try {
    let result = await add_document.updateOne({ _id: req.body._id })
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function managecategorie(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $push: {
          add_categorie: {
            addkeyword: req.body.addnewcategorie,
          },
        },
      },
      {
        new: true,
      },
    )
    if (result) {
      // res.json(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addonenewnotes(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $push: {
          notes: {
            add_notes: req.body.add_notes,
            user_name: req.body.name,
          },
        },
      },
      {
        new: true,
      },
    )
    if (result) {
      // res.json(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function navidbasedata(req) {
  try {
    let result = await add_document.find({
      parent: req.body._id,
      isFolder: 'true',
    })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function updatefiletype(req) {
  try {
    let result = await filetype.updateOne(
      { _id: req.body._id },
      {
        $set: {
          file_extenction: req.body.file_extenction,
        },
      },
    )
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function addexpirydate(req) {
  try {
    if (req.body.data.expiryDate && req.body.data.expirynotification) {
      let result = await expiry_date.findOne({ document_id: req.body._id._id })
      if (result) {
        return {
          status: 400,
          data: result,
          text: 'already in this document expiry date added !',
        }
      } else {
        req.body = {
          user_id: req.body._id.login_id._id,
          document_id: req.body._id._id,
          expiry_date: req.body.data.expiryDate,
          // prenotification: req.body.data.prenotification,
          expirynotification: req.body.data.expirynotification,
        }
        let data = expiry_date(req.body)
        let value = await data.save()
        if (value) {
          return {
            status: 200,
            data: value,
            text: 'your expiry date added succesfully !',
          }
        }
      }
    } else {
      return { status: 400, data: 'error', text: 'all fields required !' }
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  userdocument,
  trash,
  deletedocument,
  trashData,
  restoredocument,
  approvedocument,
  updateverfication,
  reject,
  nextlevel,
  document,
  updatefoldername,
  idbasedata,
  keyworddelete,
  categoriedelete,
  addreview,
  alldocument,
  keyword,
  Expirydocument,
  managecategorie,
  addonenewnotes,
  navidbasedata,
  updatefiletype,
  addexpirydate,
  foldernameupdate,
}
