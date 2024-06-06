const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
let decodedtoken = ''
verifyToken = function (req, res, next) {
  let token = req.headers.authorization
  // console.log(token)
  jwt.verify(token, 'mysecret', (err, tokendata) => {
    if (err) {
      return res.status(400).json({ message: 'Unathorized request' })
    }
    if (tokendata) {
      decodedtoken = tokendata
      // res.send(decodedtoken);
      next()
    }
  })
}
module.exports = verifyToken
