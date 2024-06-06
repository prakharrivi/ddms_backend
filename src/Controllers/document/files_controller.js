const { Router } = require('express')
const { promisify } = require('util')
const fs = require('fs/promises')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const Constant = require('../../Constant/Constant')
const bp = require('body-parser')
const SimpleGit = require('simple-git')
const textract = require('textract')

const STORAGE_DIR = Constant.storage
const TEMPLATES_DIR = path.join(STORAGE_DIR, '.templates')
const router = Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const name = path.parse(file.originalname).name
    const ext = path.extname(file.originalname)
    const repoName = path.format({
      name: `${name}_${req.timestamp}`,
      ext,
    })
    const fileRepoDirectory = path.join(STORAGE_DIR, repoName)
    fs.mkdir(fileRepoDirectory)
      .then(() => {
        cb(null, fileRepoDirectory)
      })
      .catch((e) => {
        cb(new Error(e.message))
      })
  },
  filename: function (req, file, cb) {
    const name = path.parse(file.originalname).name
    const ext = path.extname(file.originalname)
    const saveAs = path.format({
      name: `${name}_${req.timestamp}`,
      ext,
    })
    cb(null, saveAs)
  },
})
const upload = multer({ storage })
const NewDocument = require('../../models/new_document')
const User = require('../../models/Users')
const fromFileWithPath = promisify(textract.fromFileWithPath)

const accessModes = {
  public_read: 'READ',
  public_write: 'WRITE',
  members_read: 'READ',
  members_write: 'WRITE',
  owner: 'WRITE',
}

/**
 * @kind Express.js middleware
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
 * @kind Express.js middleware
 * @description Using `Date.now()` gives inconsistent values in file upload,
 * resulting in different file in supposedly same-name directory. This
 * middleware simply captures `Date.now()` and proxies it to Multer.
 */
function setTimestamp(req, _, next) {
  req.timestamp = Date.now()
  next()
}

/**
 * @method GET
 * @description Fetches name and sizes of all files in the configured storage
 * directory.
 * @todo Use streams or FileWalker to lazy load directory contents instead of
 * loading all at once.
 */
router.get('/', async (_, res) => {
  const storedFiles = await fs.readdir(STORAGE_DIR)
  const result = []
  for (const filename of storedFiles) {
    if (filename.startsWith('.')) continue
    try {
      const filepath = path.join(STORAGE_DIR, filename, filename)
      const meta = await fs.stat(filepath)
      const _index = filename.lastIndexOf('_')
      const displayName = path.format({
        name: filename.slice(0, _index),
        ext: path.extname(filename),
      })
      result.push({
        filename,
        displayName,
        filesizeInKb: meta.size / 1024,
        lastModified: meta.mtime.getTime(),
      })
    } catch {
      continue
    }
  }
  res.send(result.sort((a, b) => b.lastModified - a.lastModified))
})

/**
 * @method GET
 * @description Fetch all revisions of a given file. Since doing this for all
 * files when listing files is too expensive, we do this one-at-a-time for a
 * file in the front end, usually when the file list item is clicked.
 */
router.get('/:name/revisions', injectGit, async (req, resp) => {
  const commits = await req.git.log()
  const payload = commits.all.map((commit) => ({
    hash: commit.hash.slice(0, 7),
    message: commit.message,
    lastModified: new Date(commit.date).getTime(),
  }))
  resp.send(payload)
})

/**
 * @method POST
 * @description Upload file and initialize version control in upload directory.
 */
router.post('/', setTimestamp, upload.single('docFile'), async (req, res) => {
  const git = new SimpleGit({ baseDir: path.dirname(req.file.path) })
  git.init().add(req.file.filename).commit('Initial version (v0)')
  res.sendStatus(201)
})

/**
 * @method POST
 * @description Creates an empty document, named after the specificed name. In
 * the implementation, no file is actually created - an existing template is
 * copied (with rename) into the storage directory.
 * @todo Validate `docType` against available file types in `TEMPLATES_DIR`.
 */
router.post('/new', setTimestamp, async (req, res) => {
  const defaultDocName = 'Untitled'
  const { docType, loginId, parent } = req.body
  const newDocName = `${defaultDocName}_${req.timestamp}.${docType}`
  const newDocRepoPath = path.join(STORAGE_DIR, newDocName)
  let docDisplayName = defaultDocName

  const untitledDocuments = await NewDocument.find({
    Uploaded_image: { $regex: /^Untitled/ },
    parent,
  }).countDocuments()
  if (untitledDocuments > 0) docDisplayName += ` (${untitledDocuments})`

  // Copy template into storage directory
  await fs.mkdir(newDocRepoPath)
  await fs.copyFile(
    path.join(TEMPLATES_DIR, `template.${docType}`),
    path.join(newDocRepoPath, newDocName),
  )

  const uploader = await User.findById(loginId)
  if (!uploader) {
    res.sendStatus(401)
    return
  }

  const { size } = await fs.stat(path.join(newDocRepoPath, newDocName))

  // This doesn't need to be `await`ed
  NewDocument.create({
    Uploaded_image: docDisplayName,
    doc_url: 'document/' + newDocName,
    file_uid: newDocName,
    mode_of_creation: 'created',
    login_id: mongoose.Types.ObjectId(loginId),
    user_name: uploader.name,
    owner_email: uploader.email,
    file_size: Math.round(size / 1000),
    isFolder: false,
    document_version: 1,
    extension: path.extname(newDocName).replace(/./, ''),
    parent,
  })

  // Setup version control for the new document
  const git = new SimpleGit({ baseDir: newDocRepoPath })
  git.init().add(newDocName).commit('Initial version (v0)')
  res.send({
    fileUid: newDocName,
  })
})

/**
 * @method GET
 * @param term The search term supplied by the user.
 * @description Search content of all parseable files for the given string.
 * @returns List of file paths that contain `term` in their text.
 */
router.get('/search', async (req, res) => {
  const searchTerm = req.query['term']
  if (!searchTerm) {
    res.sendStatus(204)
    return
  }
  const allFiles = await fs.readdir(STORAGE_DIR)
  const fileUids = []
  for (const filename of allFiles) {
    if (filename.startsWith('.')) continue
    const filepath = path.join(STORAGE_DIR, filename, filename)
    try {
      const text = await fromFileWithPath(filepath)
      if (new RegExp(searchTerm, 'i').test(text))
        fileUids.push(path.basename(filepath))
    } catch {}
  }
  const payload = []
  const docs = await NewDocument.find({ file_uid: { $in: fileUids } })
  for (const doc of docs) payload.push(doc)
  res.send(payload)
})

/**
 * @method PUT
 * @param fileId The MongoDB `_id` of the document being changed.
 * @param visibility Can be one of "private" or "public".
 * @param loginId The MongoDB `_id` of the currently logged in user.
 * @description Change the given file's access mode to public or private.
 */
router.put('/set-visibility', async (req, res) => {
  const { fileId, visibility, loginId } = req.body
  try {
    const owner = await User.findById(loginId)
    if (!owner) throw new Error('Permission denied')

    const doc = await NewDocument.findById(fileId)
    if (!doc) throw new Error('No such document')

    if (doc.owner_email !== owner.email) throw new Error('Permission denied')

    await NewDocument.findOneAndUpdate(
      { _id: fileId },
      { access_mode: visibility, allowed_users: [], allowed_read_users: [] },
    )
    res.sendStatus(200)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method PUT
 * @param users List of email addresses to give access to.
 * @param _id The MongoDB `_id` of the currently logged in user.
 * @description Save given emails to the specified file's document.
 */
router.put('/add-users', async (req, res) => {
  const { fileId, users, loginId } = req.body
  try {
    if (!(users instanceof Array))
      throw new Error('Key `users` must be an array in request payload.')

    const currentUser = await User.findById(loginId)
    const doc = await NewDocument.findById(fileId)
    if (doc.owner_email != currentUser.email)
      throw new Error('Permission denied')

    await NewDocument.findOneAndUpdate(
      { _id: fileId },
      { allowed_users: users, access_mode: 'some' },
    )
    res.sendStatus(200)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method PUT
 * @param users List of email addresses to give access to.
 * @param _id The MongoDB `_id` of the currently logged in user.
 * @description Save given emails to the specified file's document for read-only access.
 */
router.put('/add-users-readonly', async (req, res) => {
  const { fileId, users, loginId } = req.body
  try {
    if (!(users instanceof Array))
      throw new Error('Key `users` must be an array in request payload.')

    const currentUser = await User.findById(loginId)
    const doc = await NewDocument.findById(fileId)
    if (doc.owner_email != currentUser.email)
      throw new Error('Permission denied')

    await NewDocument.findOneAndUpdate(
      { _id: fileId },
      { allowed_read_users: users, access_mode: 'some' },
    )
    res.sendStatus(200)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method PUT
 * @param users List of email addresses to give access to.
 * @param _id The MongoDB `_id` of the currently logged in user.
 * @description Save given emails to the documents under the given folder.
 */
router.put('/add-users-folder', async (req, res) => {
  const { folderId, users, loginId } = req.body
  try {
    if (!(users instanceof Array))
      throw new Error('Key `users` must be an array in request payload.')

    const currentUser = await User.findById(loginId)
    const doc = await NewDocument.findById(folderId)
    console.log(users)
    if (doc.owner_email != currentUser.email)
      throw new Error('Permission denied')

    await NewDocument.findOneAndUpdate(
      { _id: folderId, isFolder: 'true' },
      { allowed_users: users, access_mode: 'some' },
    )
    await NewDocument.updateMany(
      { parent: folderId },
      { allowed_users: users, access_mode: 'some' },
    )
    const doc2 = await NewDocument.findById(folderId)
    console.log(doc2)
    res.sendStatus(200)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method PUT
 * @param users List of email addresses to give access to.
 * @param _id The MongoDB `_id` of the currently logged in user.
 * @description Save emails to the docs under the given folder for read-only access.
 */
router.put('/add-users-folder-readonly', async (req, res) => {
  const { folderId, users, loginId } = req.body
  try {
    if (!(users instanceof Array))
      throw new Error('Key `users` must be an array in request payload.')

    const currentUser = await User.findById(loginId)
    const doc = await NewDocument.findById(folderId)
    if (doc.owner_email != currentUser.email)
      throw new Error('Permission denied')

    await NewDocument.findOneAndUpdate(
      { _id: folderId, isFolder: 'true' },
      { allowed_read_users: users, access_mode: 'some' },
    )
    await NewDocument.updateMany(
      { parent: folderId },
      { allowed_read_users: users, access_mode: 'some' },
    )
    res.sendStatus(200)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method POST
 * @param email The email of the currently logged in user. Can be `null` or
 * `undefined` for an unregistered user.
 * @param fileUid The full (on-disk) name of the file being opened (e.g `Example_1654855102162.docx`).
 * @description Check if the user identified by `loginId` has access to the
 * document identified by `fileUid`.
 * @todo Use user's _id instead of email as a more secure alternative.
 */
router.post('/check-access', async (req, res) => {
  const { email, fileUid } = req.body
  try {
    const doc = await NewDocument.findOne({ file_uid: fileUid })
    const user = await User.findOne({ email })
    if (!doc) throw new Error(`No such file with UID ${fileUid}`)

    // Give write access if owner opens the file
    if (doc.owner_email === email) {
      res.send({ access: 'WRITE' })
      return
    }

    // Avoid all checks if document was made public
    if (doc.access_mode === 'public_read') {
      res.send({ access: 'READ' })
      return
    }

    if (doc.access_mode === 'public_write') {
      res.send({ access: 'WRITE' })
      return
    }

    if (doc.access_mode?.startsWith('members_')) {
      if (!user) throw new Error('No such user')
      res.send({ access: accessModes[doc.access_mode] })
      return
    }

    // Perform manual check when specific users are added
    if (doc.access_mode === 'some') {
      const isWriteAllowed = doc.allowed_users.includes(email)
      const isReadAllowed = doc.allowed_read_users.includes(email)
      const access = isWriteAllowed ? 'WRITE' : isReadAllowed ? 'READ' : null
      if (!access) throw new Error('Permission denied')
      res.send({ access })
      return
    }
    res.sendStatus(401)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method PUT
 * @param folderId The MongoDB _id of the folder.
 * @param loginId The MongoDB _id of the user performing the operation.
 * @param visibility Access mode, can be one of "private" or "public".
 * @description Update `access_mode` for all documents inside the folder
 * identified by `folderId`
 */
router.put('/set-folder-visibility', async (req, res) => {
  const { folderId, loginId, visibility } = req.body
  try {
    const owner = await User.findById(loginId)
    if (!owner) throw new Error('Permission denied')

    const doc = await NewDocument.findById(folderId)
    if (!doc) throw new Error('No such document')

    if (doc.owner_email !== owner.email) throw new Error('Permission denied')

    await NewDocument.findOneAndUpdate(
      { _id: folderId, isFolder: 'true' },
      {
        $set: {
          access_mode: visibility,
          allowed_users: [],
          allowed_read_users: [],
        },
      },
    )

    const updatedDocs = await NewDocument.updateMany(
      { parent: folderId, isFolder: 'false' },
      {
        $set: {
          access_mode: visibility,
          allowed_users: [],
          allowed_read_users: [],
        },
      },
    )
    res.send(updatedDocs)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

/**
 * @method PUT
 * @param loginId The MongoDB _id of the user performing the action.
 * @param fileUid The full disk name of the document to rename.
 * @param displayName The new display name of the document.
 * @description Rename the specified document if the user is an owner.
 */
router.put('/rename', async (req, res) => {
  const { loginId, fileUid, displayName } = req.body
  let newDisplayName = displayName
  try {
    const owner = await User.findById(loginId)
    if (!owner) throw new Error('No such user')

    const doc = await NewDocument.findOne({ file_uid: fileUid })
    const parent = doc.parent

    const existingDocs = await NewDocument.find({
      Uploaded_image: { $regex: '^' + newDisplayName },
      parent,
    }).countDocuments()
    if (existingDocs > 0) newDisplayName += ` (${existingDocs})`

    await NewDocument.updateOne(
      { file_uid: fileUid, owner_email: owner.email },
      {
        $set: {
          Uploaded_image: newDisplayName,
        },
      },
    )
    res.sendStatus(200)
  } catch (e) {
    res.status(401).send(e.message)
  }
})

/**
 * @method GET
 * @param filename The actual disk-name of the document with extension.
 * @description Return details of a document identified by its `file_uid`.
 */
router.get('/document-by-uid', async (req, res) => {
  const { filename } = req.query
  const doc = await NewDocument.findOne({
    file_uid: filename,
  })
  if (!doc) {
    res.sendStatus(400)
    return
  }
  res.send(doc)
})

module.exports = router
