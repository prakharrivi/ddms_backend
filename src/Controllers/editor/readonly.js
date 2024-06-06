const SimpleGit = require('simple-git')
const bp = require('body-parser')
const { Router } = require('express')
const fs = require('fs/promises')
const path = require('path')
const Constant = require('../../Constant/Constant')
const utils = require('./utils')

const STORAGE_DIR = Constant.storage
const router = Router()

router.get('/', (_, res) => {
  res.send('Welcome to the read-only WOPI host 🎉')
})

/**
 * @method GET
 * @description Fetch file metadata for the specified file.
 */
router.get('/files/:name', async (req, res) => {
  const filename = req.params['name']
  const filepath = path.join(STORAGE_DIR, filename, filename)
  let filehash, metadata
  try {
    filehash = await utils.getFileChecksum(filepath)
    metadata = await fs.stat(filepath)
  } catch (err) {
    console.log('[CheckFileInfo] ERROR', err.message)
    res.status(400).send(err.message)
    return
  }
  res.send({
    BaseFileName: filename,
    Size: metadata.size,
    OwnerId: 1, // can be used to implement auth
    UserId: 1, // can be used to implement auth
    Version: metadata.mtime.toString(),
    LastModifiedTime: metadata.mtime,
    Sha256: filehash,
    UserCanWrite: false,
  })
})

/**
 * @method GET
 * @description Fetch contents of file by filename. The WOPI client uses the
 * response to view the file in the browser.
 */
router.get('/files/:name/contents', async (req, res) => {
  const filename = req.params['name']
  const filepath = path.join(STORAGE_DIR, filename, filename)
  let filedata, metadata
  try {
    filedata = await fs.readFile(filepath)
    metadata = await fs.stat(filepath)
  } catch (err) {
    console.log('[GetFile] ERROR', err.message)
    res.status(400).send(err.message)
    return
  }
  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Content-Disposition', 'attachment;filename=' + filename)
  res.setHeader('Content-Length', metadata.size)
  res.send(filedata)
})

module.exports = router
