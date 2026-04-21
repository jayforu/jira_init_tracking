const express = require('express')
const router = express.Router()
const db = require('../db')
const { syncProject } = require('../services/sync')

// GET /api/sync/status — sync state for all projects
router.get('/status', (req, res) => {
  const syncState = db.get('sync_state').value()
  res.json(syncState)
})

// POST /api/sync/:projectKey — trigger manual sync
router.post('/:projectKey', async (req, res) => {
  const { projectKey } = req.params
  const project = db.get('projects').find({ key: projectKey }).value()
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const current = db.get('sync_state').get(projectKey).value()
  if (current?.status === 'syncing') {
    return res.status(409).json({ error: 'Sync already in progress' })
  }

  // Fire and forget — client polls /status
  syncProject(projectKey).catch(() => {})
  res.json({ started: true })
})

module.exports = router
