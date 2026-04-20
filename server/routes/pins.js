const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  const { project } = req.query
  if (!project) return res.status(400).json({ error: 'project query param required' })
  const keys = db.get('pinned_initiatives')
    .filter({ project_key: project })
    .map('initiative_key')
    .value()
  res.json(keys)
})

router.post('/', (req, res) => {
  const { projectKey, initiativeKey } = req.body
  if (!projectKey || !initiativeKey) return res.status(400).json({ error: 'projectKey and initiativeKey required' })

  const exists = db.get('pinned_initiatives').find({ project_key: projectKey, initiative_key: initiativeKey }).value()
  if (exists) return res.status(409).json({ error: 'Already pinned' })

  db.get('pinned_initiatives').push({ project_key: projectKey, initiative_key: initiativeKey, pinned_at: new Date().toISOString() }).write()
  res.status(201).json({ projectKey, initiativeKey })
})

router.delete('/:projectKey/:initiativeKey', (req, res) => {
  const { projectKey, initiativeKey } = req.params
  const exists = db.get('pinned_initiatives').find({ project_key: projectKey, initiative_key: initiativeKey }).value()
  if (!exists) return res.status(404).json({ error: 'Pin not found' })

  db.get('pinned_initiatives').remove({ project_key: projectKey, initiative_key: initiativeKey }).write()
  res.json({ unpinned: initiativeKey })
})

module.exports = router
