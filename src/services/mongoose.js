const mongoose = require('mongoose')
const conn = mongoose.createConnection('mongodb://localhost:27017/DDMS_local')
// const conn = mongoose.createConnection("mongodb://admin:admin123@127.0.0.1:27017/admin");
exports.mongoose = mongoose
exports.conn = conn
