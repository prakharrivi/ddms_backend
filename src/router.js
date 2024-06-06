// var http = require("https");
var express = require('express')
var cors = require('cors')
var mongoose = require('mongoose')
var mysql = require('mysql')
var path = require('path')
let jwt = require('jsonwebtoken')
const auth = require('../src/middleware/auth')
const app = express()
var router = express.Router()
var glob = require('glob')
const clonedeep = require('lodash.clonedeep')
const extract = require('extract-zip')
var fs = require('fs')
var config = require('./config/service')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const multer = require('multer')
const SimpleGit = require('simple-git')

// app.use(cors());
const STORAGE_DIR = 'uploads/document'

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

/**
 * @kind Express.js middleware
 * @description Using `Date.now()` gives inconsistent values in file upload,
 * resulting in different file in supposedly same-name directory. This
 * middleware simply captures `Date.now()` and proxies it to Multer.
 */
function setTimestamp(req, _, next) {
  req.timestamp = Date.now()
  next()
}

// const swaggerDocument = require('./swagger.json');

// swaggerDocs = swaggerJsdoc(swaggerOptions)

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null,options));

// app.use(bodyParser.json({ limit: '500mb' }));
// app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000000 }));

var CronJob = require('./Routes/cron')
var routes = require('./Routes/user_routes')
var admin_routes = require('./Routes/admin_routes')
var audit_routes = require('./Routes/audit_routes')
var document_routes = require('./Routes/document_routes')
var license_routes = require('./Routes/license_routes')
var file_opertor = require('./Routes/file_operation')
var upload = require('./Routes/upload_route')
var admincontroller = require('./Controllers/admincontroller')
var dashboardcontroller = require('./Controllers/dashboardcontroller')
var userlogincontroller = require('./Controllers/user/userlogincontroller')
var userprofilecontroller = require('./Controllers/user/usermanageprofilecontroller')
var userdocumentcontroller = require('./Controllers/user/usermanagedocument_controller')
var trashcontroller = require('./Controllers/user/trashcontroller')
var documentcontroller = require('./Controllers/document/document_controller')
var userdocumentcontroller = require('./Controllers/document/userdocument_controller')
var notificationcontroller = require('./Controllers/document/notificationdocument_controller')
var requestdocumnetcontroller = require('./Controllers/document/requestdocument_controller')
var searchdocumnetcontroller = require('./Controllers/document/searchdocument_controller')

var documentlocationcontroller = require('./Controllers/document/documentlocation_controller')
var documentcommentcontroller = require('./Controllers/document/documentComment_controller')
var admindatacontroller = require('./Controllers/document/admin_data_controller')
var documentsizecontroller = require('./Controllers/document/document_size_controller')
var documentdateformet = require('./Controllers/document/document_dateformet_controller')
var documentotp = require('./Controllers/document/document_otp_controller')
var documentaudit = require('./Controllers/audit/document_audit_controller')
var useraudit = require('./Controllers/audit/user_audit_controller')
var categoryaudit = require('./Controllers/audit/category_audit_controller')
var designationaudit = require('./Controllers/audit/designation_audit_controller')
var tempaudit = require('./Controllers/audit/temp_audit_controller')
var verificationaudit = require('./Controllers/audit/verification_audit_controller')
var workflowaudit = require('./Controllers/audit/workFlow_audit_controller')
var fileoperation = require('./Controllers/fileoperation_controller')
var license = require('./Controllers/license_controller')
var applicationcontroller = require('./Controllers/applicationcontroller')
const editorController = require('./Controllers/editor')
const editorReadonlyController = require('./Controllers/editor/readonly')
var filesController = require('./Controllers/document/files_controller')

// categoryaudit  designationaudit  tempaudit verificationaudit  workflowaudit  fileoperation  license
const { zip } = require('lodash')
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());

// app.use(zip);

// app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 50000000,
  }),
)

require('./models/Users')
require('./models/loginimage')
require('./models/user_role')
require('./models/manage_quota')
require('./models/verfication-level')
require('./models/new_document')
require('./models/application_document')
require('./models/application')
require('./models/companylogo')

require('./models/temp_new')

const temp_new = mongoose.model('temp_new')
const companylogo = mongoose.model('companylogo')
const User = mongoose.model('Users')
const uploadimage = mongoose.model('loginimage')
const user_role = mongoose.model('user_role')
const manage_quota = mongoose.model('manage_quota')
const verfication = mongoose.model('verfication-level')
const add_document = mongoose.model('new_document')
const application_document = mongoose.model('application_document')
const application = mongoose.model('application')

app.use('/document', express.static('uploads/document'))
app.use('/drive', express.static('uploads/mydrive'))

app.use('/static', express.static('uploads/profile'))

let initRoutes = () => {
  glob(
    './src/Routes/*.js',
    {
      cwd: path.resolve(path.join(__dirname)),
    },
    (err, routes) => {
      if (err) {
        console.log('Error occured including routes')
        return
      }
      routes.forEach((routePath) => {
        require(routePath).getRouter(app) // eslint-disable-line
      })
    },
  )
}

// user profile update
app.post('/updateprofileimage', async function (req, res) {
  // to declare some path to store your converted image
  let base64Data = req.body.user_image
  var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
  var buf = await new Buffer.from(base64result, 'base64')
  var fs = require('fs')
  var file_extension = req.body.file_extension
  var docPath = 'profile/' + new Date().getTime() + '.' + file_extension
  var fileName = 'uploads/' + docPath
  await fs.writeFile(fileName, buf, 'base64', async function (err) {
    if (err) {
      console.log('File Error:', err)
      res.send({ error: err })
      return
    }
    var data = docPath.split('/').pop()
    let result = await User.updateOne(
      { _id: req.body._id },
      { $set: { user_image: data } },
    )
    if (result) {
      res.send(result)
    }
  })
})

//  for login background image
app.post('/uploadimage', async function (req, res) {
  let base64Data = req.body.Uploadimage
  var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
  var buf = await new Buffer.from(base64result, 'base64')
  var fs = require('fs')
  var file_extension = req.body.file_extension
  var docPath = 'profile/' + new Date().getTime() + '.' + file_extension
  var fileName = 'uploads/' + docPath
  await fs.writeFile(fileName, buf, 'base64', async function (err) {
    if (err) {
      console.log('File Error:', err)
      res.send({ error: err })
      return
    }
    var data = docPath.split('/').pop()
    let obj = {
      Uploadimage: data,
    }
    let result = await new uploadimage(obj).save()
    if (result) {
      res.send(result)
    }
  })
})

app.post('/uploadlogo', async function (req, res) {
  let newupload = new companylogo(req.body)
  let base64Data = req.body.company_logo
  var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
  var buf = await new Buffer.from(base64result, 'base64')
  var fs = require('fs')
  var file_extension = req.body.file_extension
  var docPath = 'profile/' + new Date().getTime() + '.' + file_extension
  var fileName = 'uploads/' + docPath
  await fs.writeFile(fileName, buf, 'base64', async function (err) {
    if (err) {
      console.log('File Error:', err)
      res.send({ error: err })
      return
    }
    var data = docPath.split('/').pop()
    let obj = {
      company_logo: data,
    }
    let result = await new companylogo(obj).save()
    if (result) {
      res.send(result)
    }
  })
})

var multerstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const name = path.parse(file.originalname).name
    const ext = path.extname(file.originalname)
    const repoName = path.format({
      name: `${name}_${req.timestamp}`,
      ext,
    })
    const fileRepoDirectory = path.join(STORAGE_DIR, repoName)
    fs.mkdir(fileRepoDirectory, (err) => {
      if (!err) {
        cb(null, fileRepoDirectory)
        return
      }
      cb(new Error(e.message))
    })
  },
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name
    const ext = path.extname(file.originalname)
    const saveAs = path.format({
      name: `${name}_${req.timestamp}`,
      ext,
    })
    cb(null, saveAs)
  },
})

const uploadsfile = multer({ storage: multerstorage })

app.post(
  '/addnewdocument',
  setTimestamp,
  uploadsfile.single('adddocument'),
  async function (req, res) {
    console.log(req.body, 'body')
    console.log(req.file, 'file')
    const git = new SimpleGit({ baseDir: path.dirname(req.file.path) })
    git.init().add(req.file.filename).commit('Initial version (v0)')

    // req.body.userPermission = JSON.parse(req.body.userPermission)
    // let data = await add_document.findOne({ Uploaded_image: req.body.Uploaded_image, selectdeparament: req.body.selectdeparament })
    // if (data) {
    //    res.send({ status: 400, result: data })
    // } else {

    var extension = req.body.Uploaded_image.split('.').pop()

    var docPath = 'document/' + req.file.filename

    var fileName = 'uploads/' + docPath

    let docUrl = docPath
    req.body.doc_url = docUrl
    req.body.extension = extension
    req.body.file_uid = req.file.filename
    req.body.owner_email = req.body.email
    req.body.mode_of_creation = 'uploaded'
    req.body.allowed_users = []
    req.body.allowed_read_users = []
    req.body.access_mode = 'private'

    // If Uploaded_image exists, suffix a number for the new one
    let displayName = path.parse(req.body.Uploaded_image).name
    const regex = new RegExp('^' + displayName)
    const sameNameDocsCount = await add_document
      .find({
        Uploaded_image: { $regex: regex },
        parent: req.body.parent,
      })
      .countDocuments()
    if (sameNameDocsCount > 0) displayName += ` (${sameNameDocsCount})`
    req.body.Uploaded_image = displayName

    let new_document = add_document(req.body)
    let result = await new_document.save()
    // let data = await activites.save()
    if (result) {
      res.send(result)
    }

    // }
  },
)

app.post('/dms-sdk', async function (req, res) {
  var fs = require('fs')
  req.body.company_email = req.body.company_email
  var staticPath = 'application/'
  var file_path = 'Path :/application/' + req.body.company_name

  var checkPath = path.join(
    __dirname,
    '../uploads/application/' + req.body.company_name,
  )

  if (!fs.existsSync(checkPath)) {
    fs.mkdirSync(checkPath, 0744)
  }

  var person = await application_document
    .findOne({ company_name: req.body.company_name, isFolder: 'true' })
    .exec()
  if (person) {
    req.body.parent = person._id
    req.body.isFolder = false
    req.body.file_path = file_path

    let base64Data = req.body.adddocument
    var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
    var buf = await new Buffer.from(base64result, 'base64')

    var extension = req.body.Uploaded_image.split('.').pop()
    var docPath =
      staticPath +
      req.body.company_name +
      '/' +
      (new Date().getTime() + req.body.Uploaded_image)

    var fileName = 'uploads/' + docPath

    await fs.writeFile(fileName, buf, 'base64', async function (err) {
      if (err) {
        console.log('File Error:', err)
        res.send({ error: err })
        return
      }
      let docUrl = docPath
      req.body.doc_url = docUrl
      req.body.extension = extension
      let new_document = application_document(req.body)
      let result = await new_document.save()

      if (result) {
        res.send(result)
      }
    })
  } else {
    let obj = {
      company_name: req.body.company_name,
      Uploaded_filename: req.body.company_name,
      isFolder: true,
      file_path: 'Path :/application/' + req.body.company_name,
    }

    let new_folder = new application_document(obj)
    let result = new_folder.save()
    result.then(function (result) {
      req.body.parent = result._id
    })
    let base64Data = req.body.adddocument
    var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
    var buf = await new Buffer.from(base64result, 'base64')
    var fs = require('fs')
    var extension = req.body.Uploaded_image.split('.').pop()
    var docPath =
      staticPath +
      req.body.company_name +
      '/' +
      (new Date().getTime() + req.body.Uploaded_image)

    var fileName = 'uploads/' + docPath

    await fs.writeFile(fileName, buf, 'base64', async function (err) {
      if (err) {
        console.log('File Error:', err)
        res.send({ error: err })
        return
      }
      let docUrl = docPath
      req.body.doc_url = docUrl
      req.body.extension = extension

      let new_document = application_document(req.body)
      let result = await new_document.save()

      if (result) {
        res.send(result)
      }
    })
  }
})

// ,dest: `uploads/application/${req.body.company_name}`
const uploads = multer({ storage: storage })
app.post('/api/upload', uploads.single('file'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('No File')
    return next(error)
  } else {
    res.json({
      success: true,
      filename: `${req.file.name}`,
    })
  }
})

app.use('/api/look', express.static('uploads/lookbookpdf'))
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/application/')
    mkdirp(dir, (err) => cb(err, dir)), console.log(req, 'req')
  },
  filename: (req, file, cb) => {
    let length = 15,
      charset =
        'abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      retVal = ''
    retVal2 = ''
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    for (let j = 0, n = charset.length; j < length; ++j) {
      retVal2 += charset.charAt(Math.floor(Math.random() * n))
    }
    let uniq = file.originalname.split('.')
    console.info(uniq)
    file.originalname = retVal + retVal2 + '.' + uniq[uniq.length - 1]
    cb(null, `${file.originalname}`)
  },
})

app.post('/addnewdocumentTempl', async function (req, res) {
  // let data = await add_document.findOne({ Uploaded_image: req.body.Uploaded_image, selectdeparament: req.body.selectdeparament })
  // if (data) {
  //    res.send({ status: 400, result: data })
  // } else {
  let base64Data = req.body.adddocument
  var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
  var buf = await new Buffer.from(base64result, 'base64')
  var fs = require('fs')
  var extension = req.body.Uploaded_image.split('.').pop()
  var docPath = 'document/' + (new Date().getTime() + '.' + extension)
  var fileName = 'uploads/' + docPath

  await fs.writeFile(fileName, buf, 'base64', async function (err) {
    if (err) {
      console.log('File Error:', err)
      res.send({ error: err })
      return
    }
    let docUrl = docPath
    req.body.doc_url = docUrl
    req.body.extension = extension

    let new_document = temp_new(req.body)
    let result = await new_document.save()
    // let data = await activites.save()
    if (result) {
      res.send(result)
    }
  })
  // }
})

app.post('/uploadversion', async function (req, res) {
  let base64Data = req.body.document
  var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
  var buf = await new Buffer.from(base64result, 'base64')
  var fs = require('fs')
  var extension = req.body.fileName.split('.').pop()
  var docPath = 'document/' + (new Date().getTime() + '.' + extension)
  var fileName = 'uploads/' + docPath
  debugger
  await fs.writeFile(fileName, buf, 'base64', async function (err) {
    if (err) {
      console.log('File Error:', err)
      res.send({ error: err })
      return
    }
    let docUrl = docPath
    let result = await add_document.updateOne(
      { _id: req.body._id },
      {
        $push: {
          version_contral: {
            version: req.body.version,
            fileName: req.body.fileName,
            document_url: docUrl,
            add_notes: req.body.add_notes,
            user_name: req.body.uploadversion,
          },
        },
      },
      {
        new: true,
      },
    )
    debugger
    if (result) {
      res.send(result)
    }
  })
})

// this api  work to add folder name

app.post('/addfoldername', async function (req, res) {
  let new_folder = new foldername(req.body)
  let result = new_folder.save()
  debugger
  if (result) {
    res.json(result)
  }
})

// update api login user profile update
app.post('/profileupdate', async function (req, res) {
  let userdata = new User(req.body)
  let result = await User.updateOne(
    { _id: userdata._id },
    {
      $set: {
        email: userdata.email,
        name: userdata.name,
        password: bcrypt.hashSync(userdata.password, 10),
        userRole: userdata.userRole,
        uidnumber: userdata.uidnumber,
      },
    },
  )
  if (result) {
    res.send(result)
  }
})

app.get('/', (req, res) => res.send('Hello World!'))

// delete uploaded image function
app.post('/deletecompanylogo', async function (req, res) {
  let userid = new uploadimage(req.body)
  let result = await uploadimage.remove({ _id: userid._id })
  if (result) {
    res.send(result)
  }
})

// ####--------------   Start ------------###########

// delete user profile by super admin
app.post('/userprofiledelete', async function (req, res) {
  let userid = new User(req.body)
  let result = await manage_quota.remove({ _id: userid._id })
  if (result) {
    res.send(result)
  }
})

// this api call for all asign user document

app.post('/asigndocument', async function (req, res) {
  let userData = new User(req.body)
  let result = await user_role.findOne({ user_role: userData.Roles_id })
  if (result) {
    res.send(result)
  }
})

app.get('/download/:fileName', function (req, res) {
  const file =
    './uploads/document/' + req.params.fileName + '/' + req.params.fileName
  console.log(file)
  res.download(file) // Set disposition and send it.
})

app.post('/uploadZip', async function (req, res) {
  // let data = await add_document.findOne({ Uploaded_image: req.body.Uploaded_image, selectdeparament: req.body.selectdeparament })
  // if (data) {
  //    res.send({ status: 400, result: data })
  // } else {
  obj = req.body
  clone_obj = clonedeep(obj)
  let base64Data = obj.adddocument
  var base64result = base64Data.substr(base64Data.indexOf(',') + 1)
  var buf = await new Buffer.from(base64result, 'base64')
  var fs = require('fs')
  var extension = obj.Uploaded_filename.split('.').pop()
  var folderName = obj.Uploaded_filename.split('.')[0]
  var zipPath = 'zip/' + (new Date().getTime() + obj.Uploaded_filename)
  var fileName = './uploads/' + zipPath

  await fs.writeFile(fileName, buf, 'base64', async function (err) {
    if (err) {
      console.log('File Error:', err)
      res.send({ error: err })
      return
    }
    let zipUrl = zipPath

    source = fileName
    target = __dirname + '/uploads/unzip/'
    try {
      await extract(source, { dir: target })
      console.log('Extraction complete')
    } catch (err) {
      // handle any errors
      console.log(err)
    }
    // top folder add
    let obj1 = {
      user_name: obj.user_name,
      selectdeparament: null,
      Uploaded_filename: folderName,
      isFolder: true,
      parent: obj.parent,
      userPermission: obj.FolderUserPermission,
    }
    clone_obj.Uploaded_filename = folderName
    clone_obj.file_path = folderName

    let new_document1 = add_document(obj1)
    let result = await new_document1.save()
    // target folder add
    target_path = target + folderName

    fs.readdir(target_path, async function (err, folders) {
      for (var i = 0; i < folders.length; i++) {
        let parent_info = await add_document.find({
          Uploaded_filename: folderName,
          trash: 'pending',
          parent: obj.parent,
          isFolder: true,
        })
        var parent_id = parent_info[0]._id
        var folder = folders[i]
        let obj2 = {
          user_name: obj.user_name,
          selectdeparament: null,
          Uploaded_filename: folder,
          isFolder: true,
          parent: parent_id,
          userPermission: obj.FolderUserPermission,
        }
        let new_document2 = add_document(obj2)
        let result = await new_document2.save()

        var target_path2 = target_path + '/' + folder

        fs.readdir(target_path2, async function (err, folders1) {
          for (var i = 0; i < folders1.length; i++) {
            let parent_info1 = await add_document.find({
              Uploaded_filename: folder,
              trash: 'pending',
              parent: parent_id,
              isFolder: true,
            })
            var parent_id1 = parent_info1[0]._id
            var folder1 = folders1[i]
            let obj3 = {
              user_name: obj.user_name,
              selectdeparament: null,
              Uploaded_filename: folder1,
              isFolder: true,
              parent: parent_id1,
              userPermission: obj.FolderUserPermission,
            }
            let new_document3 = add_document(obj3)
            let result = await new_document3.save()

            var target_path3 = target_path2 + '/' + folder1

            fs.readdir(target_path3, async function (err, folders2) {
              for (var i = 0; i < folders2.length; i++) {
                let parent_info2 = await add_document.find({
                  Uploaded_filename: folder1,
                  trash: 'pending',
                  parent: parent_id1,
                  isFolder: true,
                })
                var parent_id2 = parent_info2[0]._id
                var folder2 = folders2[i]
                let obj4 = {
                  user_name: obj.user_name,
                  selectdeparament: null,
                  Uploaded_filename: folder2,
                  isFolder: true,
                  parent: parent_id2,
                  userPermission: obj.FolderUserPermission,
                }
                let new_document4 = add_document(obj4)
                let result = await new_document4.save()

                // var target_path3  = target_path2 + "/" + folder1;
              }
            })
          }
        })

        var files = fs.readdirSync(target_path)
        for (var i = 0; i < files.length; i++) {
          console.log(files[i])
        }
      }
    })

    res.send([obj, clone_obj, obj1])
  })
  // }
})

app.use('/user', routes)
// app.use("/admin", admin_routes);
app.use('/audit', audit_routes)
app.use('/cron', CronJob)
app.use('/document', document_routes)
// app.use("/license", license_routes);
// app.use("/asign", file_opertor);
app.use('/upload', upload)
// admincontroller
// dashboardcontroller
app.use('/admin', admincontroller)
app.use('/dashboard', dashboardcontroller)
app.use('/userlogin', userlogincontroller)
app.use('/userprofile', userprofilecontroller)
app.use('/userdocument', userdocumentcontroller)
app.use('/trash', trashcontroller)
app.use('/document', documentcontroller)
app.use('/userdocument', userdocumentcontroller)
app.use('/notification', notificationcontroller)
app.use('/requestdocumnet', requestdocumnetcontroller)
app.use('/documentlocation', documentlocationcontroller)
app.use('/documentcomment', documentcommentcontroller)
app.use('/admindata', admindatacontroller)
app.use('/documentsize', documentsizecontroller)
app.use('/documentdateformet', documentdateformet)
app.use('/documentotp', documentotp)
app.use('/documentaudit', documentaudit)
app.use('/useraudit', useraudit)
app.use('/categoryaudit', categoryaudit)
app.use('/designationaudit', designationaudit)
app.use('/tempaudit', tempaudit)
app.use('/verificationaudit', verificationaudit)
app.use('/workflowaudit', workflowaudit)
app.use('/asign', fileoperation)
app.use('/license', license)
app.use('/searchdocumnet', searchdocumnetcontroller)
app.use('/mydrive', applicationcontroller)
app.use('/wopi', editorController)
app.use('/view/wopi', editorReadonlyController)
app.use('/files', filesController)
// applicationcontroller

// categoryaudit  designationaudit  tempaudit verificationaudit  workflowaudit  fileoperation  license
// userprofilecontroller

app.get('/', (req, res) => res.send('Node.js Server running'))

module.exports = app
