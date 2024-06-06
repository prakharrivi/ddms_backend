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
async function login(req) {
  try {
    let result = await User.findOne({ email: req.body.email }).populate(
      'Asign_storage',
    )

    if (result) {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        result.password,
      )
    }

    if (result && passwordIsValid) {
      if (result.userRole == 'Nonadmin') {
        if (result.active == 'true') {
          result.token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: '2h',
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
          //  res.send({ status: 200, data: result,token: result.token});
          return { status: 200, data: result, token: result.token }
        } else {
          return {
            status: 400,
            text: 'your account currently disbled by admin',
          }
        }
      } else {
        result.token = jwt.sign(
          { user_id: result._id, email: result.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2h',
          },
        )
        return { status: 200, data: result, token: result.token }
      }
    } else {
      return { status: 400, text: 'your email or password worng' }
    }
  } catch (error) {
    throw error
  }
}

async function savelogintime(req) {
  try {
    let result = await User.updateOne(
      { _id: req.body._id },
      {
        $push: {
          login_time: { newlogin_time: Date.now() },
        },
      },
      { new: true },
    )
    if (result) {
      return result
    }
  } catch (error) {
    throw error
  }
}

async function registration(req) {
  let response = {}
  let status
  let data
  let message
  try {
    var pass = req.body.password
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    let userData = new User(req.body)

    let result1 = await User.findOne({
      email: userData.email,
    })
    if (!result1) {
      console.log(req.body.notifyusers)
      if (req.body.notifyusers == true) {
        /*  registeration mail start */

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
              console.log('1')
              //  var result = await userData.save();

              // console.log(result," result ---")
              // response ={
              //    status: 200,
              //                         data: result,
              //                        message: "New uesr register succesfully."
              // }
              //  status = 200

              //    message = "New uesr register succesfully."
              //    console.log(status,message)
              // return {
              //          status: 200,
              //            data: result,
              //            message: "New uesr register succesfully."
              //         }
              // return result
            } else {
              // userData.isMailVerfication = false
              // var result = await userData.save();
              //  return { status: 400, data: result,
              //     message: "New uesr register succesfully, but in email id something went worng." };

              // response ={
              //    status: 400, data: result,
              //     message: "New uesr register succesfully, but in email id something went worng."
              // }
              status = 400

              message =
                'New uesr register succesfully, but in email id something went worng.'
            }
          })
        })
        // console.log(status,result,message)
        console.log('2')
        userData.isMailVerfication = true
        console.log(userData)
        var result = await userData.save()
        return {
          status: 200,
          data: result,
          message: 'New uesr register succesfully.',
        }
      } else {
        userData.isMailVerfication = false
        var result = await userData.save()
        return {
          status: 400,
          data: result,
          message: 'New uesr register succesfully, but no notified.',
        }
      }

      // mailsender.sendMail(userData, async (info) => {
      //    var result = await userData.save();
      //    res.send({
      //       status: true,
      //       data: result
      //    })
      // })
    } else {
      return {
        status: false,
        text: 'this email_id is allready register',
      }
    }
  } catch (error) {
    throw error
  }
}

async function lastlogintime(req) {
  try {
    let result = await User.find({
      userRole: req.body.userRole,
    })
    if (result) {
      return { data: result }
      // res.send({ data: result })
    } else {
      // res.send({ data: 'no User found in your area' })
      return { data: result }
    }
  } catch (error) {
    throw error
  }
}

async function departmentlogin(req) {
  try {
    let result = await User.find({
      userRole: req.body.userRole,
      selectdeparament: req.body.selectdeparament,
    })
    console.log(result)
    if (result.length != 0) {
      return { data: result }
    } else {
      // res.send({ data: 'no User found in your area' })
      // status = 400
      return { data: 'no User found in your area' }
    }
  } catch (error) {
    throw error
  }
}

async function logindata(req) {
  try {
    let result = await User.findOne({ _id: req.body._id })

    if (result) {
      return result
    } else {
      return {
        status: 401,
        text: 'login failed ! ',
      }
    }
  } catch (error) {
    throw error
  }
}

async function userdata(req) {
  try {
    let result = await User.findOne({ _id: req.body._id })
    if (result) {
      return { status: 200, data: result }
    } else {
      return { status: 400, text: 'user not found!' }
    }
  } catch (error) {
    throw error
  }
}
async function logdata(req) {
  try {
    let result = await User.find({ _id: req.body._id })
    if (result) {
      return { status: 200, data: result }
    } else {
      return { status: 400, text: 'user not found!' }
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  login,
  savelogintime,
  registration,
  lastlogintime,
  departmentlogin,
  logindata,
  userdata,
  logdata,
}
