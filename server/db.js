const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const fs = require('fs')

const dataDir = path.join(__dirname, '..', 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const adapter = new FileSync(path.join(dataDir, 'tracker.json'))
const db = low(adapter)

db.defaults({
  projects: [],
  pinned_initiatives: [],
  auth: {}
}).write()

module.exports = db
