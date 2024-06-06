var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var mongoose = require('mongoose')
var mailsender = require('./sendMail')
const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
const verifyToken = require('../Controllers/verifyToken')
var url = require('../config/service')
require('dotenv').config()

var fs = require('fs')
// here we require data base
require('../models/Users')
const User = mongoose.model('Users')

require('../models/loginimage')
const uploadimage = mongoose.model('loginimage')

require('../models/new_document')
const add_document = mongoose.model('new_document')

require('../models/mail_account')
const mail_account = mongoose.model('mail_account')

require('../models/manage_quota')
const manage_quota = mongoose.model('manage_quota')

require('../models/file_type')
const filetype = mongoose.model('file_type')

router.post('/userprofile', async function (req, res) {
  let result = await manage_quota.find({ _id: req.body._id })
  let data = await User.find({ selectdeparament: req.body.selectdeparament })
  if (result) {
    res.send({ result: result, data: data })
  }
})

router.post('/userprofile', async function (req, res) {
  let result = await manage_quota.find({ _id: req.body._id })
  let data = await User.find({ selectdeparament: req.body.selectdeparament })
  if (result) {
    res.send({ result: result, data: data })
  }
})

// save user login time

router.post('/savelogintime', async function (req, res) {
  let result = await User.update(
    { _id: req.body._id },
    {
      $push: {
        login_time: { newlogin_time: Date.now() },
      },
    },
    { new: true },
  )
  if (result) {
    res.send(result)
  }
})

// for log in user api

router.post('/login', async function (req, res) {
  console.log('result running ', req.body.email)
  // : /^bar$/i
  // {'name': {'$regex': req.body.email,$options:'i'}}
  let result = await User.findOne({
    email: { $regex: req.body.email, $options: 'i' },
  }).populate('Asign_storage')
  console.log(result?.password, 'result')
  if (result) {
    var passwordIsValid = bcrypt.compareSync(req.body.password, result.password)
  }

  console.log(result, passwordIsValid, '9999999999')
  if (result && passwordIsValid) {
    if (result.userRole == 'Nonadmin') {
      if (result.active == 'true') {
        result.token = jwt.sign(
          { user_id: result._id, email: result.email },
          process.env.TOKEN_KEY,
          {
            //expiresIn: "2m",
          },
        )

        let result1 = await User.updateOne(
          { email: req.body.email },
          {
            $set: {
              last_login_date: Date.now(),
              ip_address: req.body.ip_address,
            },
          },
        )
        res.send({ status: 200, data: result, token: result.token })
      } else {
        return res.send({
          status: 400,
          text: 'your account currently disbled by admin',
        })
      }
    } else {
      result.token = jwt.sign(
        { user_id: result._id, email: result.email },
        process.env.TOKEN_KEY,
        {
          //expiresIn: "2w",
        },
      )
      return res.send({ status: 200, data: result, token: result.token })
    }
  } else {
    return res.send({ status: 400, text: 'your email or password worng' })
  }
})

// get all background image

router.get('/backgroundimage', async function (req, res) {
  let result = await uploadimage.find().sort({ $natural: -1 })
  if (result) {
    res.send(result)
  }
})

router.post('/updateimage', async function (req, res) {
  let data = !req.body.display_image
  let value = await uploadimage.updateOne(
    { _id: req.body._id },
    {
      $set: {
        display_image: data,
      },
    },
  )
  if (value) {
    res.send(value)
  }
})

// get all qutoa user
router.get('/allquota', async function (req, res) {
  let result = await manage_quota.find()
  if (result) {
    res.send(result)
  }
})

// for reset password api
router.post('/resetpassword', async function (req, res) {
  console.log(' user loute')
  console.log(' user loute', req.body)
  let userData = new User(req.body)

  let result = await User.findOne({ email: userData.email })
  if (result) {
    userData.otp = Math.floor(1000 + Math.random() * 9000)
    let updateResult = await User.updateOne(
      { email: req.body.email },
      {
        $set: {
          Otp: userData.otp,
        },
      },
    )
    let template_url = 'assets/template/resetpassword.html'

    fs.readFile(template_url, async function read(err, bufcontent) {
      var content = (bufcontent || '').toString()
      // content = content.replace('$user$', result.name).replace("$otp$", userData.otp)

      var mailObject = await mailsender.GetMailObject(
        req.body.email,
        'DDMS',
        'hello',
        null,
        null,
      )
      console.log(mailObject, 'forgot password------------------1')
      mailsender.sendEmail(mailObject, function (mailres) {
        res.send({ status: 200, data: mailres })
      })
    })

    // mailsender.sendotp(userData, async (info) => {
    //    if (result) {
    //       res.send({
    //          status: 200,
    //          data: result
    //       })
    //    }
    // })
  } else {
    res.send({
      status: 400,
      text: 'this email id is not exist',
    })
  }
})

// get all manage quotas

router.get('/managequotas', async function (req, res) {
  let result = await manage_quota.find()
  if (result) {
    res.send(result)
  }
})

// delete user profile by super admin
router.post('/userdelete', async function (req, res) {
  let userid = new User(req.body)
  let result = await User.deleteOne({ _id: userid._id })
  if (result) {
    res.send(result)
  }
})

router.get('/userdata/:id', async function (req, res) {
  try {
    var adminLogin = await User.findById(req.params.id).exec()
    res.send(adminLogin)
  } catch (error) {
    res.status(500).send(error)
  }
})
// router.post('/userdataByMail/', async function (req, res) {
//    try {
//     var result = await User.aggregate([
//         { $match: {email: req.body.email}},
//     ]);
//     console.log(result)
//     res.send(result);
//  } catch (error) {
//     res.status(500).send(error);
//  }
//  })
// update user profile on the basis of user profile
router.post('/updateuserprofile', async function (req, res) {
  let userid = new User(req.body)
  let result = await User.updateOne(
    { _id: userid.id },
    {
      $set: {
        // bcrypt.hashSync(userid.password, 10)
        password: bcrypt.hashSync(userid.password, 10),
        name: userid.name,
        uidnumber: userid.uidnumber,
        email: userid.email,
        Asign_storage: userid.Asign_storage,
        active: userid.active,
        con_number: userid.con_number,
        User_type: userid.User_type,
        notifyusers: userid.notifyusers,
        selectdeparament: userid.selectdeparament,
        add_desgination: userid.add_desgination,
        Allowmailintegration: userid.Allowmailintegration,
        Roles_id: userid.Roles_id,
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
})

// password update api
router.post('/passwordupdate', async function (req, res) {
  // bcrypt.hashSync(req.body.password, 10)
  console.log('password update')
  req.body.password = bcrypt.hashSync(req.body.password, 10)
  let result = await User.updateOne(
    { email: req.body.email, Otp: req.body.otp },
    {
      $set: {
        password: req.body.password,
      },
    },
    { multi: true },
  )
  if (result.nModified == 1) {
    res.send({ status: 200, data: result })
  } else {
    res.send({ status: 400 })
  }
})

// for new user register api
router.post('/registration', async function (req, res) {
  console.log(' registration work ')
  var pass = req.body.password
  req.body.password = bcrypt.hashSync(req.body.password, 10)
  let userData = new User(req.body)

  let result1 = await User.findOne({
    email: userData.email,
  })
  if (!result1) {
    if (req.body.notifyusers == true) {
      let template_url = 'assets/template/user_registration.html'
      fs.readFile(template_url, async function read(err, bufcontent) {
        var content = (bufcontent || '').toString()
        content = content
          .replace('$user$', req.body.name)
          .replace('$password$', pass)
          .replace('$email$', req.body.email)
          .replace('$url$', url.BASEURL + 'auth/login')
        var mailObject = await mailsender.GetMailObject(
          req.body.email,
          'DDMS',
          content,
          null,
          null,
        )
        mailsender.sendEmail(mailObject, async function (mailres) {
          if (mailres.mailsuccess) {
            userData.isMailVerfication = true
            var result = await userData.save()
            res.send({
              status: true,
              data: result,
              message: 'New uesr register succesfully.',
            })
          } else {
            userData.isMailVerfication = false
            var result = await userData.save()
            res.send({
              status: 400,
              data: result,
              message:
                'New uesr register succesfully, but in email id something went worng.',
            })
          }
        })
      })
    } else {
      userData.isMailVerfication = false
      var result = await userData.save()
      res.send({
        status: 400,
        data: result,
        message:
          'New uesr register succesfully, but in email id something went worng.',
      })
    }

    // mailsender.sendMail(userData, async (info) => {
    //    var result = await userData.save();
    //    res.send({
    //       status: true,
    //       data: result
    //    })
    // })
  } else {
    res.send({
      status: false,
      text: 'this email_id is allready register',
    })
  }
})

// login user api
router.post('/userdata', async function (req, res) {
  let result = await User.findOne({ _id: req.body._id })
  if (result) {
    res.send({ status: 200, data: result })
  } else {
    res.send({ status: 400, text: 'user not found!' })
  }
})

router.post('/logdata', async function (req, res) {
  let result = await User.find({ _id: req.body._id })
  if (result) {
    res.send({ status: 200, data: result })
  } else {
    res.send({ status: 400, text: 'user not found!' })
  }
})

// this api work for search parameter base data

router.post('/searchdata', async function (req, res) {
  let result = ''
  if (req.body.parameter == 'User Id') {
    let result = await User.findOne({
      uidnumber: req.body.value,
    })
    if (result) {
      res.send(result)
    } else {
      res.send({ status: 400, text: 'user not found!' })
    }
  } else if (req.body.parameter == 'Notes') {
    let result = await add_document.findOne({
      document_notes: req.body.value,
    })
    if (result) {
      res.send(result)
    } else {
      res.send({ status: 400, text: 'user not found!' })
    }
  } else if (req.body.parameter == 'File Keywords') {
    let result = await add_document.find({
      'add_keyword.addkeyword': req.body.value,
    })
    if (result) {
      res.send(result)
    } else {
      res.send({ status: 400, text: 'user not found!' })
    }
  } else if (req.body.parameter == 'File Types') {
    let result = await filetype.findOne({ file_extenction: req.body.value })
    if (result) {
      res.send(result)
    } else {
      res.send({ status: 400, text: 'this file extenction not found!' })
    }
  } else if (req.body.parameter == 'File Folder') {
    let result = await add_document.find({ Uploaded_filename: req.body.value })
    if (result) {
      res.send(result)
    } else {
      res.send({ status: 400, text: 'this file folder not found!' })
    }
  }
})

// this api work for get all mail

router.get('/getmail', async function (req, res) {
  let result = await mail_account.find()
  if (result) {
    res.send(result)
  }
})

// this api work for add  mail account

router.post('/addnewmail', async function (req, res) {
  let new_mail = mail_account(req.body)
  let result = await new_mail.save()
  if (result) {
    res.send(result)
  }
})

// delete mail account

router.post('/maildelete', async function (req, res) {
  let result = await mail_account.deleteOne({ _id: req.body._id })
  if (result) {
    res.send(result)
  }
})

// this api get all
router.post('/lastlogintime', async function (req, res) {
  let result = await User.find({
    userRole: req.body.userRole,
  })
  if (result) {
    res.send({ data: result })
  } else {
    res.send({ data: 'no User found in your area' })
  }
})

// api login data get for department wise

router.post('/departmentlogin', async function (req, res) {
  let result = await User.find({
    userRole: req.body.userRole,
    selectdeparament: req.body.selectdeparament,
  })
  if (result) {
    res.send({ data: result })
  } else {
    res.send({ data: 'no User found in your area' })
  }
})

router.post('/updatemailAccount', async function (req, res) {
  let result = await mail_account.update(
    { _id: req.body._id },
    {
      $set: {
        mail_protocol: req.body.mail_protocol,
        mail_host: req.body.mail_host,
        mail_user: req.body.mail_user,
        mail_folder: req.body.mail_folder,
        Active: this.Active,
        mail_mark: this.mail_mark,
        mail_delete: this.mail_delete,
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
})

// add new quota for Storage
router.post('/addquota', async function (req, res) {
  let data = await manage_quota.findOne({ user_name: req.body.user_name })
  if (data) {
    res.json({ status: 400 })
  } else {
    let userdata = new manage_quota(req.body)
    let result = await userdata.save()
    if (result) {
      res.send(result)
    }
  }
})

// edit user profile on the basis of _id

router.post('/edituserprofile', async function (req, res) {
  let userid = new manage_quota(req.body)
  let result = await manage_quota.update(
    { _id: userid.id },
    {
      $set: {
        active: userid.active,
        manage_quota: userid.manage_quota,
        profile_type: userid.profile_type,
        user_name: userid.user_name,
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
})

router.post('/trashdata', async function (req, res) {
  let result = await manage_quota.update(
    { _id: req.body._id },
    {
      $set: {
        manage_trash: req.body.data,
      },
    },
    {
      new: true,
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/managesection', async function (req, res) {
  let result = await manage_quota.update(
    { _id: req.body._id },
    {
      $set: {
        manage_section: req.body.data,
      },
    },
    {
      new: true,
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/managdocument', async function (req, res) {
  let result = await manage_quota.update(
    { _id: req.body._id },
    {
      $set: {
        manage_document: req.body.data,
      },
    },
    {
      new: true,
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/managemail', async function (req, res) {
  let result = await manage_quota.update(
    { _id: req.body._id },
    {
      $set: {
        manage_mail: req.body.data,
      },
    },
    {
      new: true,
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/managecommon', async function (req, res) {
  let result = await manage_quota.update(
    { _id: req.body._id },
    {
      $set: {
        manage_common: req.body.data,
      },
    },
    {
      new: true,
    },
  )
  if (result) {
    res.send(result)
  }
})

router.post('/managefolder', async function (req, res) {
  let result = await manage_quota.update(
    { _id: req.body._id },
    {
      $set: {
        manage_folder: req.body.data,
      },
    },
    {
      new: true,
    },
  )
  if (result) {
    res.send(result)
  }
})

router.get('/alluser', async function (req, res) {
  let result = await User.find()
  if (result) {
    res.send(result)
  }
})
router.get('/getbyiduser', verifyToken, async function (req, res) {
  let result = await User.find().limit(1)
  if (result) {
    return res.send(result)
  } else {
    return res.status(403).send({ message: 'No Record Found.' })
  }
})

router.post('/alluser', async function (req, res) {
  let result = await User.find({ email: { $regex: req.body.keyword } })
  if (result) {
    res.send(result)
  }
})

// get all nonadmin user
router.post('/getalluser', async function (req, res) {
  let userData = new User(req.body)
  let result = await User.find({
    selectdeparament: req.body.selectdeparament,
  }).populate('Asign_storage')
  if (result) {
    res.send(result)
  } else {
    res.send({
      status: 401,
      text: 'no user present at this time! ',
    })
  }
})

router.post('/logindata', async function (req, res) {
  let result = await User.findOne({ _id: req.body._id })

  if (result) {
    return res.send(result)
  } else {
    return res.send({
      status: 401,
      text: 'login failed ! ',
    })
  }
})

module.exports = router
