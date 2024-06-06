const path = require('path')

module.exports = Object.freeze({
  saveSuccessMessage: 'Data saved',
  saveFailedMessage: 'Data not saved',
  updateSuccessMessage: 'Data Updated',
  deleteSuccessMessage: 'Data Deleted',
  updateFailedMessage: 'Data not updated',
  recordFetchedMassage: 'Record fetched',
  noRecordMessage: 'No record found',

  respCode200: 200, // Success
  respCode204: 204, // No content
  respCode400: 400, // Bad request
  respCode500: 500, // Internal server error

  employeeType: 1,
  operatorType: 2,

  siteEngineerRole: 1,
  projectInchargeRole: 2,
  siteAdminRole: 3,
  headOfficeRole: 5,
  storeInchargeRole: 6,

  uomOilChange: 96, //Hours

  acilBaseUrl: 'http://208.109.9.215/SITACENTRAL',

  baseLocation: '/home/pankaj/app/AcilImages',

  storage: path.join(process.cwd(), 'uploads/document'),
})
