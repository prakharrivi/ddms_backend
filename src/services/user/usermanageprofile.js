var nodemailer = require('nodemailer')
var mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
var mailsender = require('../../Routes/sendMail')
var url = require('../../config/service')
require('dotenv').config()

var fs = require('fs')

require('../../models/Users')
const User = mongoose.model('Users')

require('../../models/loginimage')
const uploadimage = mongoose.model('loginimage')

require('../../models/new_document')
const add_document = mongoose.model('new_document')

require('../../models/mail_account')
const mail_account = mongoose.model('mail_account')

require('../../models/manage_quota')
const manage_quota = mongoose.model('manage_quota')

require('../../models/file_type')
const filetype = mongoose.model('file_type')

async function userprofile(req) {
  try {
    let result = await manage_quota.find({ _id: req.body._id })
    let data = await User.find({ selectdeparament: req.body.selectdeparament })
    if (result) {
      return { result: result, data: data }
    }
  } catch (error) {
    throw error
  }
}

async function backgroundimage(req) {
  try {
    let result = await uploadimage.find().sort({ $natural: -1 })
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updateimage(req) {
  try {
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
      return value
    }
  } catch (error) {
    throw error
  }
}

async function allquota(req) {
  try {
    let result = await manage_quota.find()
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function resetpassword(req) {
  try {
    var data
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
        content = content
          .replace('$user$', result.name)
          .replace('$otp$', userData.otp)

        var mailObject = await mailsender.GetMailObject(
          req.body.email,
          'DDMS',
          content,
          null,
          null,
        )
        //   console.log(mailObject, "forgot password------------------1")
        mailsender.sendEmail(mailObject, function (mailres) {
          console.log('runn ')
          console.log(mailres)

          data = mailres
        })
      })
      return { status: 200 }

      // mailsender.sendotp(userData, async (info) => {
      //    if (result) {
      //       res.send({
      //          status: 200,
      //          data: result
      //       })
      //    }
      // })

      // return { status: 200,data: data };
    } else {
      return {
        status: 400,
        text: 'this email id is not exist',
      }
    }
  } catch (error) {
    throw error
  }
}

async function userdelete(req) {
  try {
    let userid = new User(req.body)
    let result = await User.deleteOne({ _id: userid._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function managequotas(req) {
  try {
    let result = await manage_quota.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function userdata(req) {
  try {
    var adminLogin = await User.findById(req.params.id).exec()
    // res.send(adminLogin);
    return adminLogin
  } catch (error) {
    // res.status(500).send(error);
    throw error
  }
}

async function updateuserprofile(req) {
  try {
    let userid = new User(req.body)
    console.log(userid)
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
      // res.send({
      //    status: 200,
      //    data: result
      // })
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
async function getmail(req) {
  try {
    let result = await mail_account.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function addnewmail(req) {
  try {
    let new_mail = mail_account(req.body)
    let result = await new_mail.save()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function maildelete(req) {
  try {
    let result = await mail_account.deleteOne({ _id: req.body._id })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function updatemailAccount(req) {
  try {
    let result = await mail_account.updateOne(
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

async function addquota(req) {
  try {
    let data = await manage_quota.findOne({ user_name: req.body.user_name })
    if (data) {
      // res.json({ status: 400 })
      return { status: 400 }
    } else {
      let userdata = new manage_quota(req.body)
      let result = await userdata.save()
      if (result) {
        // res.send(result)
        return result
      }
    }
  } catch (error) {
    throw error
  }
}

async function edituserprofile(req) {
  try {
    let userid = new manage_quota(req.body)
    let result = await manage_quota.updateOne(
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
async function alluser(req) {
  try {
    let result = await User.find()
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}
async function getbyiduser(req) {
  try {
    let result = await User.find().limit(1)
    if (result) {
      // return res.send(result)
      return result
    } else {
      // return res.status(403).send({ message: "No Record Found." });
      return {
        status: 403,
        message: 'No Record Found.',
      }
    }
  } catch (error) {
    throw error
  }
}
async function alluserdata(req) {
  // alluser in  post method
  try {
    let result = await User.find({ email: { $regex: req.body.keyword } })
    if (result) {
      // res.send(result)
      return result
    }
  } catch (error) {
    throw error
  }
}

async function getalluser(req) {
  try {
    let userData = new User(req.body)
    let result = await User.find({
      selectdeparament: req.body.selectdeparament,
    }).populate('Asign_storage')
    if (result) {
      // res.send(result)
      return result
    } else {
      return {
        status: 401,
        text: 'no user present at this time! ',
      }
    }
  } catch (error) {
    throw error
  }
}

async function passwordupdate(req) {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    // bcrypt.hashSync(req.body.password, 10)
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
      return { status: 200, data: result }
    } else {
      return { status: 400 }
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  userprofile,
  backgroundimage,
  updateimage,
  allquota,
  resetpassword,
  userdelete,
  managequotas,
  userdata,
  updateuserprofile,
  getmail,
  addnewmail,
  maildelete,
  updatemailAccount,
  addquota,
  edituserprofile,
  alluser,
  getbyiduser,
  alluserdata,
  getalluser,
  passwordupdate,
}
