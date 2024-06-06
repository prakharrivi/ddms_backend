var express = require('express')
var router = express.Router()
var CronJob = require('cron').CronJob
var Cron = require('./mongodb_backup.js')

new CronJob(
  '0 0 0 * * *',
  function () {
    // Cron.dbAutoBackUp();
    Cron.getdatewisefile()
  },
  null,
  true,
  'America/New_York',
)

module.exports = router
