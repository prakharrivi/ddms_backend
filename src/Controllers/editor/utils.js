const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const LOGFILE = path.join(__dirname, 'server.log')

/**
 * @param {string} path Absolute path to the file.
 * @returns {string} A hex-encoded SHA256 string of given file.
 * @description Generates SHA256 hash of the file at `path`.
 */
async function getFileChecksum(path) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(path)
    stream.on('error', (err) => reject(err))
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

/**
 * @param {string} log A one-liner log entry.
 * @description Writes the entry to a log file.
 * @todo Create file or diretory if it doesn't exist.
 */
async function appendLog(log) {
  return new Promise((resolve) => {
    const timestamp = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')
    const payload = `[${timestamp}] ${log} \n`
    fs.appendFile(LOGFILE, payload, (err) => {
      resolve()
    })
  })
}

module.exports = {
  appendLog,
  getFileChecksum,
}
