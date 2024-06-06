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

var BreakdownReportService = require('../services/adminservice')
var Constant = require('../../src/Constant/Constant')

router.post('/addgroupname', async function (req, res) {
  var response = {}
  BreakdownReportService.addgroupname(req)
    .then(function (data) {
      if (data && data[0] > 0) {
        // response = {
        //     respMessage: Constant.recordFetchedMassage,
        //     respCode: Constant.respCode200,
        //     totalRecord: data[0],
        //     data: data[1],
        // };
        res.send(data)
      } else {
        response = {
          respMessage: Constant.noRecordMessage,
          respCode: Constant.respCode204,
          totalRecord: data[0],
          data: data[1],
        }
      }
      res.status(200).send(response)
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
  // let new_metadata = metadatagroup(req.body)
  // let result = await new_metadata.save()
  // if (result) {
  //     res.send(result)
  // }
})

router.post('/uploadlogo', async function (req, res) {
  BreakdownReportService.uploadlogo(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/companylogo', async function (req, res) {
  BreakdownReportService.companylogos(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/updateimage', async function (req, res) {
  BreakdownReportService.updateimage(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/deleteuploadedimage', async function (req, res) {
  BreakdownReportService.deleteuploadedimage(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/deleteimage', async function (req, res) {
  BreakdownReportService.deleteimage(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/updatefolderGet/:id', async (req, res) => {
  BreakdownReportService.updatefolderGet(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.patch('/updatefolder/:id', async (req, res) => {
  BreakdownReportService.updatefolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getalltemplatedocument', async function (req, res) {
  BreakdownReportService.getalltemplatedocument(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getalldocumentCheckFile', async function (req, res) {
  BreakdownReportService.getalldocumentCheckFile(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getalldocument', async function (req, res) {
  BreakdownReportService.getalldocument(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getalldocumentTemp', async function (req, res) {
  BreakdownReportService.getalldocumentTemp(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getalldocument/:id', async function (req, res) {
  BreakdownReportService.getalldocuments(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/shearuser', async function (req, res) {
  BreakdownReportService.shearuser(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/superadmincall', async function (req, res) {
  BreakdownReportService.superadmincall(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/superTemplatecall', async function (req, res) {
  BreakdownReportService.superTemplatecall(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getallfiledata', async function (req, res) {
  BreakdownReportService.getallfiledata(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getallfolder', async function (req, res) {
  BreakdownReportService.getallfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getallTempfolder', async function (req, res) {
  BreakdownReportService.getallTempfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/allfolder', async function (req, res) {
  BreakdownReportService.allfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/allTempfolder', async function (req, res) {
  BreakdownReportService.allTempfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/diskmanagement', async function (req, res) {
  BreakdownReportService.diskmanagement(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/superadmindata', async function (req, res) {
  BreakdownReportService.superadmindata(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/filecountbase', async function (req, res) {
  // let data = await add_document.find({selectdeparament : req.body.selectdeparament})

  BreakdownReportService.filecountbase(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/getfolder', async function (req, res) {
  BreakdownReportService.getfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/addnewcron', async function (req, res) {
  BreakdownReportService.addnewcron(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getallfile', async function (req, res) {
  BreakdownReportService.getallfile(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/addfiletype', async function (req, res) {
  BreakdownReportService.addfiletype(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/deletefile', async function (req, res) {
  BreakdownReportService.deletefile(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/crondelete', async function (req, res) {
  BreakdownReportService.crondelete(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/updatecron', async function (req, res) {
  BreakdownReportService.updatecron(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getallcron', async function (req, res) {
  BreakdownReportService.getallcron(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/parentbase', async function (req, res) {
  // var allG7ToShare = [];

  BreakdownReportService.parentbase(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/updateparentroot', async function (req, res) {
  BreakdownReportService.updateparentroot(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/subfolder', async function (req, res) {
  BreakdownReportService.subfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/navigateUp', async function (req, res) {
  BreakdownReportService.navigateUp(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/addnewfolder', async function (req, res) {
  BreakdownReportService.addnewfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/addnewtempfolder', async function (req, res) {
  BreakdownReportService.addnewtempfolder(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/addnewdocument', async function (req, res) {
  BreakdownReportService.addnewdocument(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getallcoustomdata', async function (req, res) {
  BreakdownReportService.getallcoustomdata(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/updatemeta', async function (req, res) {
  BreakdownReportService.updatemeta(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/deletecoustomedata', async function (req, res) {
  BreakdownReportService.deletecoustomedata(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/updateroleprofile', async function (req, res) {
  BreakdownReportService.updateroleprofile(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getallroles', async function (req, res) {
  BreakdownReportService.getallroles(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/role', async function (req, res) {
  BreakdownReportService.role(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/deleterole', async function (req, res) {
  BreakdownReportService.deleterole(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/addkeyword', async function (req, res) {
  BreakdownReportService.addkeyword(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/folderdelete', async function (req, res) {
  // let userid = new User(req.body)
  BreakdownReportService.folderdelete(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/filename', async function (req, res) {
  BreakdownReportService.filename(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/updatefoldername', async function (req, res) {
  // let userid = new User(req.body)

  BreakdownReportService.updatefoldername(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.post('/exportfolderWzip', async function (req, res) {
  BreakdownReportService.exportfolderWzip(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/getfolderappication', async function (req, res) {
  BreakdownReportService.getfolderappication(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})

router.get('/updatefolderGetapplication/:id', async function (req, res) {
  BreakdownReportService.updatefolderGetapplication(req)
    .then(function (data) {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(204).send(Constant.noRecordMessage)
      }
    })
    .catch((err) =>
      res.status(500).send({
        respCode: Constant.respCode500,
        respMessage: err.message,
      }),
    )
})
// updatefolderGetapplication

module.exports = router
