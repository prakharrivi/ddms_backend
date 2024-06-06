var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
let jwt = require('jsonwebtoken')
var url = require('../config/service')
// var mailsender = require('./mailsend.js');
// var mailsender = require('./sendMail');
var zip = new require('node-zip')()
var bodyParser = require('body-parser')
require('dotenv').config()

require('../models/add_folder')
const foldername = mongoose.model('add_folder')

require('../models/add_metadatagroup')
const metadatagroup = mongoose.model('add_metadatagroup')

require('../models/companylogo')
const companylogo = mongoose.model('companylogo')

require('../models/new_document')
const add_document = mongoose.model('new_document')
require('../models/application_document')
const application_document = mongoose.model('application_document')
require('../models/temp_new')
const temp_new = mongoose.model('temp_new')

require('../models/user_role')
const user_role = mongoose.model('user_role')

require('../models/Users')
const User = mongoose.model('Users')

require('../models/add_cron')
const cron = mongoose.model('add_cron')

require('../models/file_type')
const filetype = mongoose.model('file_type')

require('../models/verfication-level')
const verfication = mongoose.model('verfication-level')

require('../models/loginimage')
const uploadimage = mongoose.model('loginimage')

// router.post('/addgroupname', async function (req, res) {
//     let new_metadata = metadatagroup(req.body)
//     let result = await new_metadata.save()
//     if (result) {
//         res.send(result)
//     }
// })

async function addgroupname(req) {
  var response = []
  try {
    let new_metadata = metadatagroup(req.body)
    let result = await new_metadata.save()
    // response.push(result);
    console.log(result, 'result')
    return result
    // response.push(data);
  } catch (error) {
    throw error
  }
}

async function uploadlogo(req) {
  try {
    let newupload = new companylogo(req.body)
    if (req.body.imageid) {
      let result = await companylogo.updateOne(
        { _id: req.body.imageid },
        {
          $set: {
            company_logo: newupload.company_logo,
          },
        },
      )
      if (result) {
        // res.send(result)
        return result
      }
    } else {
      let result = await newupload.save(req.body)
      if (result) {
        // res.send(result)
        return result
      }
    }
  } catch (error) {
    throw error
  }
}

async function companylogos(req) {
  try {
    let result = await companylogo.find().sort({ $natural: -1 })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updateimage(req) {
  try {
    let data = !req.body.display_image
    let value = await companylogo.updateOne(
      { _id: req.body._id },
      {
        $set: {
          display_image: data,
        },
      },
    )
    if (value) {
      // res.send(value)
      return value
    }
  } catch (error) {
    throw error
  }
}

async function deleteuploadedimage(req) {
  try {
    let userid = new companylogo(req.body)
    let result = await companylogo.deleteOne({ _id: userid._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function deleteimage(req) {
  try {
    let result = await uploadimage.deleteOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function updatefolderGet(req) {
  try {
    var person = await add_document.findById(req.params.id).exec()
    person.set(req.body)
    var result = await person.save()
    // res.send(result);
    return result
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

async function updatefolderGetapplication(req) {
  try {
    var person = await application_document
      .find({ parent: { $eq: req.params.id } })
      .exec()
    // person.set(req.body);
    // var result = await person.save();
    // res.send(result);
    return person
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}
async function updatefolder(req) {
  try {
    var person = await add_document.findById(req.params.id).exec()
    person.set(req.body)
    var result = await person.save()
    if (result) {
      return result
    }
    // res.send(result);

    req.body.url = url.fileurl + '/dashboard/explorer/' + req.body.parent
    let template_url = 'assets/template/fileshare.html'
    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      let jwt_secret = 'mysecret'
      let token = jwt.sign({ id: req.body.selectuserid }, jwt_secret, {
        expiresIn: '1d',
      })
      content = content
        .replace('$user$', req.body.usename)
        .replace('$folderfilename$', req.body.Uploaded_filename)
        // http://52.66.111.224:3000/auth/myfile/preview?
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
      mailsender.sendEmail(mailObject, async function (mailres) {})
    })
    var result = await person.save()
    // res.send(result);
    return result
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

async function getalltemplatedocument(req) {
  try {
    console.log(new Date())
    let result = await temp_new
      .find({ parent: req.body.parent, trash: 'pending' })
      .populate('file_shear.user_id login_id')
    console.log(new Date())
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
async function getalldocumentCheckFile(req) {
  try {
    let result = await add_document
      .findOne({
        login_id: req.body.login_id,
        parent: req.body.parent,
        Uploaded_image: req.body.Uploaded_image,
        trash: 'pending',
        isFolder: false,
      })
      .populate('file_shear.user_id login_id')
    if (result) {
      return {
        data: result,
        error: true,
        message: 'file this name all ready exist',
      }
    } else {
      return { data: result, error: false, message: 'no file found!' }
    }
  } catch (error) {
    throw error
  }
}

async function getalldocument(req) {
  try {
    let result = await add_document
      .find({ parent: req.body.parent, trash: 'pending', documentexpiry: true })
      .populate('file_shear.user_id login_id')
      .sort({ _id: -1 })
    if (result) {
      // res.send(result)\
      return result
    } else {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getalldocumentTemp(req) {
  try {
    let result = await temp_new
      .find({ parent: req.body.parent, trash: 'pending' })
      .populate('file_shear.user_id login_id')
    if (result) {
      // res.send(result)
      return result
    } else {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getalldocuments(req) {
  try {
    let result = await add_document.findOne({ _id: req.params.id })
    if (result) {
      // res.send(result)
      return result
    } else {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function shearuser(req) {
  try {
    let result = await add_document.find({
      file_shear: {
        $elemMatch: { user_id: req.body._id, parent: req.body.parent },
      },
    })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function superadmincall(req) {
  try {
    let result = await add_document
      .find({
        parent: req.body.parent,
        owner_email: req.body.email,
        trash: 'pending',
        documentexpiry: true,
      })
      .populate('login_id')
      .sort({ Uploaded_filename: 1 })

    const folderPayload = await add_document.aggregate([
      {
        $match: {
          isFolder: 'false',
          trash: 'pending',
          parent: { $ne: 'root' },
        },
      },
      { $group: { _id: '$parent', fileCount: { $sum: 1 } } },
    ])

    result = result.map((doc) => {
      if (doc.isFolder !== 'true') return doc
      const clonedDoc = JSON.parse(JSON.stringify(doc))
      const folders = folderPayload.filter((f) => f['_id'] == clonedDoc['_id'])
      if (folders.length > 0) clonedDoc.fileCount = folders[0]['fileCount']
      return clonedDoc
    })

    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function superTemplatecall(req) {
  try {
    let result = await temp_new.find({
      parent: req.body.parent,
      trash: 'pending',
    })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getallfiledata(req) {
  try {
    let result = await add_document.find({
      parent: req.body.parent,
      isFolder: 'false',
    })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function getallfolder(req) {
  try {
    let result = await add_document.find({
      parent: req.body.parent,
      isFolder: 'true',
      trash: 'pending',
    })
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getallTempfolder(req) {
  try {
    let result = await temp_new.find({
      parent: req.body.parent,
      isFolder: 'true',
      trash: 'pending',
    })
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function allfolder(req) {
  try {
    let result = await add_document
      .find({
        parent: req.body.parent,
        owner_email: req.body.email,
        isFolder: 'true',
        trash: 'pending',
      })
      .sort({ Uploaded_filename: 1 })
    if (result) {
      return result
    } else {
      console.log('already exist')
      return { status: 501, message: 'User email is already registerd.' }
    }
  } catch (error) {
    throw error
  }
}

async function allTempfolder(req) {
  try {
    let result = await temp_new.find({
      parent: req.body.parent,
      isFolder: 'true',
      trash: 'pending',
    })
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function diskmanagement(req) {
  try {
    totalfilecount = Object()
    let result = await add_document.find({ parent: req.body.parent })
    if (result) {
      for (var i = 0; i < result.length; i++) {
        let data = await add_document.count({
          parent: result[i].id,
          isFolder: 'true',
        })
        var totalfilecount = data
        result[i].filecount = totalfilecount
      }
      for (var k = 0; k < result.length; k++) {
        totalsize = ''
        let file = await add_document.find({
          parent: result[k].id,
          isFolder: 'false',
        })
        for (var j = 0; j < file.length; j++) {
          var totalsize = +totalsize + +file[j]._doc.file_size
        }
        var gettotal = totalsize / 1000
        var n = gettotal.toFixed(2)
        result[k].totalusesize = n
      }
      let data = await add_document.find({
        parent: req.body.parent,
        isFolder: 'false',
      })
      return { result, data }
    } else {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function superadmindata(req) {
  try {
    console.log(req.body, 'req.body')
    let result = await add_document
      .find({ isFolder: req.body.folder, trash: 'pending' })
      .sort({ $natural: -1 })
      .limit(5)
    let data = await add_document
      .find({ isFolder: req.body.file, trash: 'pending', documentexpiry: true })
      .sort({ $natural: -1 })
      .limit(5)
    let user = await User.countDocuments()
    let file = await add_document.countDocuments({ isFolder: req.body.file })
    let department = await add_document.countDocuments({
      isFolder: req.body.file,
      created_at: {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
    })
    let month = await add_document.countDocuments({
      isFolder: req.body.file,
      created_at: {
        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
      },
    })
    if (result) {
      return { result, data, user, file, department, month }
    }
  } catch (error) {
    throw error
  }
}
async function filecountbase(req) {
  try {
    let result = await add_document.aggregate([
      { $group: { _id: '$extension', count: { $sum: 1 } } },
    ])
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getfolder(req) {
  try {
    let result = await add_document
      .find({
        isFolder: req.body.folder,
        trash: 'pending',
        selectdeparament: req.body.selectdeparament,
      })
      .sort({ $natural: -1 })
      .limit(5)
    let data = await add_document
      .find({
        isFolder: req.body.file,
        login_id: req.body._id,
        trash: 'pending',
        documentexpiry: true,
      })
      .sort({ $natural: -1 })
      .limit(5)
    let user = await User.countDocuments({
      selectdeparament: req.body.selectdeparament,
    })
    let file = await add_document.countDocuments({
      isFolder: req.body.file,
      selectdeparament: req.body.selectdeparament,
    })
    let department = await add_document.countDocuments({
      isFolder: req.body.file,
      selectdeparament: req.body.selectdeparament,
      created_at: {
        $gte: new Date(new Date().setHours(00, 00, 00)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
    })
    let month = await add_document.countDocuments({
      isFolder: req.body.file,
      selectdeparament: req.body.selectdeparament,
      created_at: {
        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
      },
    })
    if (result) {
      return { result, data, user, file, department, month }
    }
  } catch (error) {
    throw error
  }
}

async function addnewcron(req) {
  try {
    let new_document = cron(req.body)
    let result = await new_document.save()
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getallfile(req) {
  try {
    let result = await filetype.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addfiletype(req) {
  try {
    let new_file = filetype(req.body)
    let result = await new_file.save()
    if (result) {
      // res.json(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function deletefile(req) {
  try {
    let result = await filetype.deleteOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function crondelete(req) {
  try {
    let result = await cron.deleteOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updatecron(req) {
  try {
    let result = await cron.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          active: req.body.active,
          mail: req.body.mail,
          expression: req.body.expression,
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

async function getallcron(req) {
  try {
    let result = await cron.find()
    if (result) {
      // res.json(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function parentbase(req) {
  try {
    let result = await add_document
      .find({ parent: req.body.parent, trash: 'pending', documentexpiry: true })
      .populate('file_shear.user_id login_id')
      .sort({ _id: -1 })
    // let value = await add_document.find({ file_shear: { $elemMatch: { user_id: req.body._id, parent: req.body.parent } } })
    //    let document  = result.concat(value)
    if (result) {
      // res.send(result)
      return result
    } else {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updateparentroot(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body.updatefile },
      {
        $set: {
          parent: req.body._id,
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

async function subfolder(req) {
  try {
    let result = await add_document.find({
      parent: req.body._id,
      isFolder: 'true',
    })
    if (result) {
      // res.send(result)
      return result
    } else {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function navigateUp(req) {
  try {
    let result = await add_document.find({ _id: req.body.parent })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addnewfolder(req) {
  try {
    let new_document = add_document(req.body)
    let result = await new_document.save()
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}
async function getfolderappication(req) {
  try {
    console.log('result ')
    // var mysort = { position: 1 };
    var result = await application_document
      .find({ isFolder: { $eq: 'true' } })
      .exec()
    console.log(result, 'result ')
    // res.send(result);
    return result
  } catch (error) {
    throw error
  }
}
async function addnewtempfolder(req) {
  try {
    let new_document = temp_new(req.body)
    let result = await new_document.save()
    if (result) {
      // res.json(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function addnewdocument(req) {
  try {
    let data = await verfication.count()
    //let verfication_level = req.body.data
    req.body.verfication_level = data
    let new_document = add_document(req.body)
    let result = await new_document.save()
    // let data = await activites.save()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function getallcoustomdata(req) {
  try {
    let result = await metadatagroup.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updatemeta(req) {
  try {
    let result = await metadatagroup.updateOne(
      { _id: req.body._id },
      {
        $set: {
          Group_name: req.body.Group_name,
        },
      },
    )
    if (result) {
      return {
        status: 200,
        data: result,
      }
    }
  } catch (error) {
    throw error
  }
}
async function deletecoustomedata(req) {
  try {
    let userid = new User(req.body)
    let result = await metadatagroup.deleteOne({ _id: userid.id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updateroleprofile(req) {
  try {
    let userid = new user_role(req.body)
    let result = await user_role.updateOne(
      { _id: userid.id },
      {
        $set: {
          user_role: userid.user_role,
        },
      },
    )
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
  } catch (error) {
    throw error
  }
}
async function getallroles(req) {
  try {
    let result = await user_role.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function role(req) {
  try {
    let newrole = new user_role(req.body)
    let result = await newrole.save()
    if (result) {
      return {
        status: true,
        data: result,
      }
    } else {
      return {
        status: false,
      }
    }
  } catch (error) {
    throw error
  }
}

async function deleterole(req) {
  try {
    let userid = new User(req.body)
    let result = await user_role.deleteOne({ _id: userid._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function addkeyword(req) {
  try {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $push: {
          add_keyword: {
            addkeyword: req.body.keyword,
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

async function folderdelete(req) {
  try {
    let result = await add_document.deleteOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function filename(req) {
  try {
    let data = await add_document.findOne({
      Uploaded_image: req.body.Uploaded_image,
    })
    if (data) {
      return { status: 400, text: 'this folder name all ready exit' }
    } else {
      let result = await add_document.updateOne(
        { _id: req.body._id },
        {
          $set: {
            Uploaded_image: req.body.Uploaded_image,
          },
        },
      )
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

async function updatefoldername(req) {
  try {
    let data = await add_document.findOne({
      Uploaded_filename: req.body.Uploaded_filename,
    })
    if (data) {
      return { status: 400, text: 'this folder name all ready exit' }
    } else {
      let result = await add_document.update(
        { _id: req.body._id },
        {
          $set: {
            Uploaded_filename: req.body.Uploaded_filename,
          },
        },
      )
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

async function exportfolderWzip(req) {
  try {
    let data = await add_document.findOne({ _id: req.body._id })
    folderName = data.Uploaded_filename
    id = data._id

    let underfolders = await add_document.find({
      parent: id,
      trash: 'pending',
      isFolder: 'true',
    })
    let underfiles = await add_document.find({
      parent: id,
      trash: 'pending',
      isFolder: 'false',
    })

    zipName = folderName + '.zip'
    mainzip = zip.folder(folderName)
    for (i = 0; i < underfolders.length; i++) {
      cur_folder = underfolders[i]
      cur_folder_name = cur_folder['Uploaded_filename']
      cur_folder_id = cur_folder['_id']

      f_zip = mainzip.folder(cur_folder_name)
      f_under_folder = await add_document.find({
        parent: cur_folder_id,
        trash: 'pending',
        isFolder: 'true',
      })
      f_under_file = await add_document.find({
        parent: cur_folder_id,
        trash: 'pending',
        isFolder: 'false',
      })
      for (j = 0; j < f_under_folder.length; j++) {
        f_folder = f_under_folder[j]
        f_folder_name = f_folder['Uploaded_filename']
        f_folder_id = f_folder['_id']
        s_zip = f_zip.folder(f_folder_name)

        s_under_folder = await add_document.find({
          parent: f_folder_id,
          trash: 'pending',
          isFolder: 'true',
        })
        s_under_file = await add_document.find({
          parent: f_folder_id,
          trash: 'pending',
          isFolder: 'false',
        })
        for (k = 0; k < s_under_folder.length; k++) {
          s_folder = s_under_folder[k]
          s_folder_name = s_folder['Uploaded_filename']
          s_folder_id = s_folder['_id']
          t_zip = s_zip.folder(s_folder_name)
          t_under_folder = await add_document.find({
            parent: s_folder_id,
            trash: 'pending',
            isFolder: 'true',
          })
          t_under_file = await add_document.find({
            parent: s_folder_id,
            trash: 'pending',
            isFolder: 'false',
          })
          for (l = 0; l < t_under_folder.length; l++) {
            t_folder = t_under_folder[l]
            t_folder_name = t_folder['Uploaded_filename']
            t_folder_id = t_folder['_id']
            fo_zip = t_zip.folder(t_folder_name)
            fo_under_folder = await add_document.find({
              parent: t_folder_id,
              trash: 'pending',
              isFolder: 'true',
            })
            fo_under_file = await add_document.find({
              parent: t_folder_id,
              trash: 'pending',
              isFolder: 'false',
            })
            for (m = 0; m < fo_under_folder.length; m++) {
              fo_folder = fo_under_folder[l]
              fo_folder_name = fo_folder['Uploaded_filename']
              fo_folder_id = fo_folder['_id']
              fi_zip = fo_zip.folder(fo_folder_name)
              fi_under_file = await add_document.find({
                parent: fo_folder_id,
                trash: 'pending',
                isFolder: 'false',
              })
              for (n = 0; n < fi_under_file.length; n++) {
                fi_file = fi_under_file[n]
                fi_file_name = fi_file['doc_url'].split('/')[1]
                fiurl = './uploads/document/' + fi_file_name
                fi_filedata = fs.readFileSync(fiurl)
                fi_zip.file(fi_file_name, fi_filedata, { base64: true })
              }
            }
            for (m = 0; m < fo_under_file.length; m++) {
              fo_file = fo_under_file[l]
              fo_file_name = fo_file['doc_url'].split('/')[1]
              fourl = './uploads/document/' + fo_file_name
              fo_filedata = fs.readFileSync(fourl)
              fo_zip.file(fo_file['Uploaded_image'], fo_filedata, {
                base64: true,
              })
            }
          }
          for (l = 0; l < t_under_file.length; l++) {
            t_file = t_under_file[l]
            t_file_name = t_file['doc_url'].split('/')[1]
            turl = './uploads/document/' + t_file_name
            t_filedata = fs.readFileSync(turl)
            t_zip.file(t_file['Uploaded_image'], t_filedata, { base64: true })
          }
        }
        for (k = 0; k < s_under_file.length; k++) {
          s_file = s_under_file[k]
          s_file_name = s_file['doc_url'].split('/')[1]
          surl = './uploads/document/' + s_file_name
          s_filedata = fs.readFileSync(surl)
          s_zip.file(s_file['Uploaded_image'], s_filedata, { base64: true })
        }
      }
      for (j = 0; j < f_under_file.length; j++) {
        f_file = f_under_file[j]
        f_file_name = f_file['doc_url'].split('/')[1]
        furl = './uploads/document/' + f_file_name
        f_filedata = fs.readFileSync(furl)
        f_zip.file(f_file['Uploaded_image'], f_filedata, { base64: true })
      }
    }
    for (i = 0; i < underfiles.length; i++) {
      cur_file = underfiles[i]
      cur_file_name = cur_file['doc_url'].split('/')[1]
      url = './uploads/document/' + cur_file_name
      filedata = fs.readFileSync(url)
      mainzip.file(cur_file['Uploaded_image'], filedata, { base64: true })
    }
    filePath = process.env.BASE_URL + 'download/' + zipName
    console.log(filePath, 'filePath')
    fileName = zipName
    console.log(filePath, 'filePath', fileName, 'fileName')
    var options = { base64: false, compression: 'DEFLATE' }
    fs.writeFile(
      './download/' + zipName,
      zip.generate(options),
      'binary',
      function (error) {
        console.log('Wrote ' + zipName, filePath, error)
      },
    )
    resp = {}
    resp['filePath'] = filePath
    resp['fileName'] = zipName
    // res.send(resp);
    return resp
  } catch (error) {
    throw error
  }
}
module.exports = {
  addgroupname,
  uploadlogo,
  companylogos,
  updateimage,
  deleteuploadedimage,
  deleteimage,
  updatefolderGet,
  updatefolder,
  getalltemplatedocument,
  getalldocumentCheckFile,
  getalldocument,
  getalldocumentTemp,
  getalldocuments,
  shearuser,
  superadmincall,
  superTemplatecall,
  getallfiledata,
  getallfolder,
  getallTempfolder,
  allfolder,
  allTempfolder,
  diskmanagement,
  superadmindata,
  filecountbase,
  getfolder,
  addnewcron,
  getallfile,
  addfiletype,
  deletefile,
  crondelete,
  updatecron,
  getallcron,
  parentbase,
  updateparentroot,
  subfolder,
  navigateUp,
  addnewfolder,
  addnewtempfolder,
  addnewdocument,
  getallcoustomdata,
  updatemeta,
  deletecoustomedata,
  updateroleprofile,
  getallroles,
  role,
  deleterole,
  addkeyword,
  folderdelete,
  filename,
  updatefoldername,
  exportfolderWzip,
  getfolderappication,
  updatefolderGetapplication,
}
