var fs = require('fs')
var _ = require('lodash')
var exec = require('child_process').exec

var mongoose = require('mongoose')
var mailsender = require('./mailsend.js')

require('../models/documentexpiry')
const expiry = mongoose.model('documentexpiry')

require('../models/new_document')
const documentId = mongoose.model('new_document')

require('../models/Users')
const user = mongoose.model('Users')

var dbOptions = {
  user: 'ddms_db',
  pass: 'Rjt12345',
  host: 'cluster0-6e6cd.mongodb.net',
  port: 27017,
  database: 'test',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 2,
  autoBackupPath: './src/restore', // i.e. /var/database-backup/
}

/* return date object */
exports.stringToDate = function (dateString) {
  return new Date(dateString)
}

/* return if variable is empty or not. */
exports.empty = function (mixedVar) {
  var undef, key, i, len
  var emptyValues = [undef, null, false, 0, '', '0']
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false
    }
    return true
  }
  return false
}

// Auto backup script

exports.dbAutoBackUp = function () {
  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
    var date = new Date()
    var beforeDate, oldBackupDir, oldBackupPath
    currentDate = this.stringToDate(date) // Current date
    var newBackupDir =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getDate()
    var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir // New backup path for current backup process
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate)
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup) // Substract number of days to keep backup and remove old backup
      oldBackupDir =
        beforeDate.getFullYear() +
        '-' +
        (beforeDate.getMonth() + 1) +
        '-' +
        beforeDate.getDate()
      oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir // old backup(after keeping # of days)
    }
    // var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process

    //var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
    var cmd =
      'mongodump --uri mongodb+srv://ddms_db:Rjt12345@cluster0-6e6cd.mongodb.net/test ' +
      '--out ' +
      newBackupPath
    exec(cmd, function (error, stdout, stderr) {
      if (!error) {
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
          // if (fs.existsSync(oldBackupPath)) {
          //     exec("rm -rf " + oldBackupPath, function (err) { });
          // }
        }
      }
    })
  }
}

exports.getdatewisefile = async function () {
  let data = await expiry.find({
    expiry_date: { $gte: new Date() },
    documentexpiry: false,
  })
  if (data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      let docu_expiry = await expiry.updateOne(
        { _id: data[i].id },
        {
          $set: {
            documentexpiry: true,
          },
        },
      )
      console.log(docu_expiry)
      let userdata = await user.findOne({ _id: data[i].user_id })
      let updateStatus = await documentId.updateOne(
        { _id: data[i].document_id },
        {
          $set: {
            documentexpiry: false,
          },
        },
      )
      console.log(updateStatus)
      let template_url = 'assets/template/docuExpiry.html'
      fs.readFile(template_url, async function read(err, bufcontent) {
        var content = (bufcontent || '').toString()
        content = content
          .replace('$user$', userdata.name)
          .replace('$message$', data[0].expirynotification)
        var mailObject = await mailsender.GetMailObject(
          userdata.email,
          'Document Expiry  ',
          content,
          null,
          null,
        )
        mailsender.sendEmail(mailObject, function (mailres) {
          console.log({ status: 200, data: mailres })
        })
      })
    }
  } else {
    console.log('nothing file get')
  }
}
