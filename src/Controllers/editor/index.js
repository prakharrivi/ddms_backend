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
  res.send('Welcome to the WOPI host 🎉')
})

/**
 * @type Express.js middleware
 * @description Attaches a SimpleGit instance to `req.git` for the given file.
 */
async function injectGit(req, res, next) {
  const fileRepo = path.join(STORAGE_DIR, req.params['name'])
  try {
    await fs.stat(fileRepo) // Will error out if file doesn't exist
    req.git = new SimpleGit({
      baseDir: fileRepo,
    })
    next()
  } catch (e) {
    res.status(400).send(e.message)
  }
}

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

  /**
   * SECURITY NOTE:
   * At the moment, anyone can access the editor given the link. This can be
   * prevented using access control to send a 401 or 400 response status.
   * To provide read-only access, the user can be authorized against a
   * database, and the `UserCanWrite` property in response can be set to true
   * or false based on the user's access level.
   */
  res.send({
    BaseFileName: filename,
    Size: metadata.size,
    OwnerId: 1, // can be used to implement auth
    UserId: 1, // can be used to implement auth
    Version: metadata.mtime.toString(),
    LastModifiedTime: metadata.mtime,
    Sha256: filehash,
    UserCanWrite: true, // only send when user is authenticated
  })
})

/**
 * @method GET
 * @description Fetch contents of file by filename. The WOPI client uses the
 * response to view the file in the browser.
 */
router.get('/files/:name/contents', injectGit, async (req, res) => {
  const filename = req.params['name']
  let version = req.query['v']
  if (version?.includes('?')) {
    version = version.substring(0, version.indexOf('?'))
  }
  const filepath = path.join(STORAGE_DIR, filename, filename)
  let filedata, metadata
  try {
    // Checkout desired commit to read contents; then revert to latest commit
    const commits = await req.git.log()
    const latestCommitHash = commits.latest.hash
    /**
     * `git show` is a faster alternative to read file contents, since
     * it does not require checking out the commit. Unfortunately, it does not
     * work here for binary data like '.pptx' (although it should). However,
     * the current approach has the benefit that the file stats are correct,
     * since an actual checkout happens on the file.
     */
    await req.git.checkout(version || latestCommitHash)
    filedata = await fs.readFile(filepath)
    metadata = await fs.stat(filepath)
    await req.git.checkout(latestCommitHash)
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

/**
 * @method POST
 * @description Overwrite file content and commit changes for the given file.
 */
router.post(
  '/files/:name/contents',
  bp.raw({ limit: '10mb' }),
  injectGit,
  async (req, res) => {
    req.setEncoding(null)
    const filename = req.params['name']
    const updatedContent = req.body
    const filepath = path.join(STORAGE_DIR, filename, filename)
    try {
      const commits = await req.git.log()
      await req.git.checkout(commits.latest.hash)
      await fs.writeFile(filepath, updatedContent)
      req.git.add(filename).commit(`Version v${commits.total}`)
      res.sendStatus(200)
    } catch (err) {
      console.log('[PutFile] ERROR', err.message)
      res.status(400).send(err.message)
    }
  },
)

module.exports = router
