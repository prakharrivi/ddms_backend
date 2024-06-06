var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
let jwt = require('jsonwebtoken')
var url = require('../config/service')

// var mailsender = require('./mailsend.js');
var mailsender = require('./sendMail')
require('../models/temp_new')
const temp_new = mongoose.model('temp_new')
require('../models/Users')
const User = mongoose.model('Users')

require('../models/new_document')
const add_document = mongoose.model('new_document')

require('../models/user_role')
const role = mongoose.model('user_role')

require('../models/file_type')
const filetype = mongoose.model('file_type')

require('../models/work_flow')
const work_flows = mongoose.model('work_flow')

require('../models/add_designation')
const designation = mongoose.model('add_designation')

require('../models/verfication-level')
const verfication = mongoose.model('verfication-level')

require('../models/categories')
const categories_wise = mongoose.model('categories')

require('../models/documentexpiry')
const expiry_date = mongoose.model('documentexpiry')

router.post('/datebasedata', async function (req, res) {
  if (req.body.select == 'Log In') {
    let data = await User.find({
      last_login_date: { $gte: req.body.startDate, $lte: req.body.endDate },
    })
    if (data) {
      res.send(data)
    }
  } else if (req.body.select == 'Uploaded File') {
    let data = await add_document.find({
      created_at: { $gte: req.body.startDate, $lte: req.body.endDate },
      isFolder: 'false',
    })
    if (data) {
      res.send(data)
    }
  } else if (req.body.select == 'Upload Folder') {
    let data = await add_document.find({
      created_at: { $gte: req.body.startDate, $lte: req.body.endDate },
      isFolder: 'true',
    })
    if (data) {
      res.send(data)
    }
  } else if (req.body.select == 'File Type') {
    let data = await filetype.find({
      created_at: { $gte: req.body.startDate, $lte: req.body.endDate },
    })
    if (data) {
      res.send(data)
    }
  }
})

router.post('/adddepartment', async function (req, res) {
  let data = work_flows(req.body)
  let result = await data.save()
  if (result) {
    res.send(result)
  }
})

router.post('/adddesignation', async function (req, res) {
  let user = await designation.findOne({
    add_desgination: req.body.add_desgination,
    add_department: req.body.add_department,
  })
  if (!user) {
    let data = designation(req.body)
    let result = await data.save()
    if (result) {
      res.send({ result: result, status: 200 })
    }
  } else {
    res.send({ status: 400 })
  }
})

router.post('/deletedesignation', async function (req, res) {
  let result = await designation.remove({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})

router.post('/getalldesignation', async function (req, res) {
  let result = await designation.find({
    add_department: req.body.add_department,
  })
  if (result) {
    res.send(result)
  }
})

router.post('/userdocument', async function (req, res) {
  let result = await add_document
    .find({ login_id: req.body._id, isFolder: req.body.file, trash: 'pending' })
    .populate('login_id')
  if (result) {
    res.send(result)
  }
})

router.get('/trash', async function (req, res) {
  let result = await add_document.find({ trash: 'delete' })
  if (result) {
    res.send(result)
  }
})
router.get('/trashTemp', async function (req, res) {
  let result = await temp_new.find({ trash: 'delete' })
  if (result) {
    res.send(result)
  }
})

router.post('/deletedocument', async function (req, res) {
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
    res.send(result)
  }
})
router.post('/deletedocumentTemp', async function (req, res) {
  let result = await temp_new.updateOne(
    { _id: req.body._id },
    {
      $set: {
        trash: 'delete',
      },
    },
  )
  if (result) {
    res.send(result)
  }
})
router.get('/deleteTemp', async (req, res) => {
  let result = await temp_new.find()
  if (result) {
    res.json(result)
  }
  // try {
  //     var result = await temp_new.deleteOne({_id: req.params.id}).exec();
  //     res.send(result);
  //     console.log(result);
  // } catch (error) {
  //     res.status(500).send(error);
  // }
})
router.delete('/trashData/:id', async (req, res) => {
  try {
    var result = await add_document.deleteOne({ _id: req.params.id }).exec()
    res.send(result)
    console.log(result)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.delete('/trashDataTemp/:id', async (req, res) => {
  try {
    var result = await temp_new.deleteOne({ _id: req.params.id }).exec()
    res.send(result)
    console.log(result)
  } catch (error) {
    res.status(500).send(error)
  }
})
router.post('/deletedocumentData', async function (req, res) {
  let result = await temp_new.updateOne(
    { _id: req.body._id },
    {
      $set: {
        trash: 'delete',
      },
    },
  )
  if (result) {
    res.send(result)
  }
})
router.post('/restoredocument', async function (req, res) {
  let result = await add_document.updateOne(
    { _id: req.body._id },
    {
      $set: {
        trash: 'pending',
      },
    },
  )
  if (result) {
    res.send(result)
  }
})
router.post('/restoredocumentTemp', async function (req, res) {
  let result = await temp_new.updateOne(
    { _id: req.body._id },
    {
      $set: {
        trash: 'pending',
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/approvedocument', async function (req, res) {
  let result = await add_document
    .find({
      verfication: req.body.verfication_level,
      isFolder: 'false',
      selectdeparament: req.body.selectdeparament,
    })
    .populate('login_id')
  if (result) {
    res.send(result)
  }
})

router.post('/updateverfication', async function (req, res) {
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
      res.send(result)
    })
  })
})

router.post('/reject', async function (req, res) {
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
    res.send(result)
  }
})

router.post('/nextlevel', async function (req, res) {
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
    res.send(result)
  }
})

router.post('/updatedesgination', async function (req, res) {
  let result = await designation.updateOne(
    { _id: req.body._id },
    {
      $set: {
        add_department: req.body.add_department,
        add_desgination: req.body.add_desgination,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/updatedepartment', async function (req, res) {
  let result = await work_flows.updateOne(
    { _id: req.body._id },
    {
      $set: {
        add_department: req.body.add_department,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/deprarement', async function (req, res) {
  let result = await designation.find({
    add_department: req.body.selectdeparament,
  })
  if (result) {
    res.send(result)
  }
})

router.post('/getall', async function (req, res) {
  let result = await work_flows.find({
    add_department: req.body.add_department,
  })
  // let data =  await
  if (result) {
    res.send(result)
  }
})

router.get('/alldepartment', async function (req, res) {
  let result = await work_flows.find()
  if (result) {
    res.send(result)
  }
})

router.post('/deletedeparment', async function (req, res) {
  let result = await work_flows.remove({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})

router.get('/document', async function (req, res) {
  let result = await add_document
    .find({ isFolder: 'false' })
    .populate('login_id')
  if (result) {
    res.send(result)
  }
})

router.post('/getuser', async function (req, res) {
  let result = await User.find({
    selectdeparament: req.body.add_department,
    add_desgination: req.body.add_desgination,
  })
  if (result) {
    res.send(result)
  }
})

router.post('/getverfication', async function (req, res) {
  let result = await verfication.find({
    add_department: req.body.add_department,
  })
  if (result) {
    res.send(result)
  }
})

router.post('/addverfication', async function (req, res) {
  let data = verfication(req.body)
  let user = await data.save()
  let userdata = await User.updateOne(
    { _id: req.body.user_name },
    {
      $set: {
        verfication_level: req.body.verfication_level,
      },
    },
  )
  if (user) {
    res.send(user)
  }
})

router.post('/getallverfication', async function (req, res) {
  let result = await verfication
    .find({ add_department: req.body.add_department })
    .populate('user_name')
  if (result) {
    res.send(result)
  }
})

router.post('/updateverficationlevel', async function (req, res) {
  let result = await verfication.updateOne(
    { _id: req.body._id },
    {
      $set: {
        add_department: req.body.add_department,
        add_desgination: req.body.add_desgination,
        verfication_level: req.body.verfication_level,
        user_name: req.body.user_name,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/deleteverfication', async function (req, res) {
  let data = await verfication.remove({ _id: req.body._id })
  if (data) {
    res.send(data)
  }
})

router.post('/Catdelete', async function (req, res) {
  // let userid = new User(req.body)
  let result = await categories_wise.remove({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})
router.post('/updatefoldername', async function (req, res) {
  // let userid = new User(req.body)
  let data = await categories_wise.findOne({
    folder_name: req.body.folder_name,
  })
  if (data) {
    res.json({ status: 400, text: 'this folder name all ready exit' })
  } else {
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $set: {
          folder_name: req.body.folder_name,
        },
      },
    )
    if (result) {
      res.send({
        status: 200,
        data: result,
      })
    } else {
      res.send({
        status: 400,
      })
    }
  }
})
router.post('/addcategories', async function (req, res) {
  let data = categories_wise(req.body)
  let result = await data.save()
  if (result) {
    res.send(result)
  }
})

router.get('/allcategories', async function (req, res) {
  let result = await categories_wise.find()
  if (result) {
    res.send(result)
  }
})

router.post('/idbasedata', async function (req, res) {
  let result = await add_document.find({ categories_id: req.body._id })
  if (result) {
    res.send(result)
  } else {
    res.send(result)
  }
})

router.post('/navidbasedata', async function (req, res) {
  let result = await add_document.find({
    parent: req.body._id,
    isFolder: 'true',
  })
  if (result) {
    res.send(result)
  }
})

router.post('/keyworddelete', async function (req, res) {
  let result = await add_document.updateOne(
    { _id: req.body.obj },
    { $pull: { add_keyword: { _id: req.body.addkeyword } } },
    { multi: true },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/categoriedelete', async function (req, res) {
  let result = await add_document.updateOne(
    { _id: req.body._id },
    { $pull: { add_categorie: { _id: req.body.categories_id } } },
    { multi: true },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/updatefiletype', async function (req, res) {
  let result = await filetype.updateOne(
    { _id: req.body._id },
    {
      $set: {
        file_extenction: req.body.file_extenction,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

router.get('/getalluser', async function (req, res) {
  let result = await User.find()
  let data = await role.find()
  if (result) {
    res.send({ result, data })
  }
})

router.post('/addreview', async function (req, res) {
  let result = await add_document.updateOne(
    { _id: req.body._id },
    {
      $set: {
        add_review: req.body.review,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

// this function work to get user upload data

router.get('/alldocument', async function (req, res) {
  let result = await add_document.find({ isFolder: 'false' })
  if (result) {
    res.send(result)
  }
})

router.post('/keyword', async function (req, res) {
  let result = await add_document.findOne({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})

router.post('/Expirydocument', async function (req, res) {
  let result = await add_document.updateOne({ _id: req.body._id }, {})
})

router.post('/managecategorie', async function (req, res) {
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
    res.json(result)
  }
})

router.post('/addonenewnotes', async function (req, res) {
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
    res.json(result)
  }
})

router.post('/addexpirydate', async function (req, res) {
  if (req.body.data.expiryDate && req.body.data.expirynotification) {
    let result = await expiry_date.findOne({ document_id: req.body._id._id })
    if (result) {
      res.send({
        status: 400,
        data: result,
        text: 'already in this document expiry date added !',
      })
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
        res.send({
          status: 200,
          data: value,
          text: 'your expiry date added succesfully !',
        })
      }
    }
  } else {
    res.send({ status: 400, data: 'error', text: 'all fields required !' })
  }
})

// router.post('/addcomment', async function(req,res){
// let result =  await add_document.update(
//     {'_id': req.body._id},
//     { $pull: { "items" : { id: 23 } } },
// false,
// true
// );
// if(result){
//     res.send(result)
// }
// })

module.exports = router
