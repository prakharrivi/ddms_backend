const fs = require('fs')
const http = require('http')
require('dotenv').config()
const app = require('./src/router')
const initDb = require('./src/config/db')
const config = require('./src/config/service')

const port = process.env.PORT || 3001
// const options = {
//   key: fs.readFileSync('./ssl/privkey.pem'),
//   cert: fs.readFileSync('./ssl/cert.pem'),
// }
const server = http.createServer(app).listen(port, () => {
  console.log('[*] API serving on port', port)
})
