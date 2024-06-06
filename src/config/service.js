require('dotenv').config()
module.exports = {
  fromEmail: process.env.MAIL_FROM,
  mail_port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  // need to change your username password
  username: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  BASEURL: process.env.BASE_URL,
  fileurl: process.env.FILE_URL,
}
