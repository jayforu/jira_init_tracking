const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  res.json(db.get('projects').value())
})

router.post('/', async (req, res) => {
  const { key, name } = req.body
  if (!key || !name) return res.status(400).json({ error: 'key and name are required' })

  const upperKey = key.toUpperCase()

  try {
    await req.jira.getProject(upperKey)
  } catch (err) {
    const status = err.response?.status
    if (status === 404) return res.status(404).json({ error: `Project "${upperKey}" not found in Jira` })
    console.error('getProject error:', status, err.response?.data || err.message)
    return res.status(status || 502).json({ error: err.response?.data?.errorMessages?.[0] || err.message })
  }

  try {
    const exists = db.get('projects').find({ key: upperKey }).value()
    if (exists) return res.status(409).json({ error: `Project "${upperKey}" is already configured` })

    const project = { key: upperKey, name, created_at: new Date().toISOString() }
    db.get('projects').push(project).write()
    res.status(201).json(project)
  } catch (err) {
    console.error('DB write error:', err.message)
    res.status(500).json({ error: 'Failed to save project' })
  }
})

router.patch('/:key', (req, res) => {
  const { key } = req.params
  const project = db.get('projects').find({ key }).value()
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const allowed = ['test_source', 'tracked_board_id', 'tracked_board_name']
  const updates = {}
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = req.body[field]
  }

  db.get('projects').find({ key }).assign(updates).write()
  res.json(db.get('projects').find({ key }).value())
})

router.delete('/:key', (req, res) => {
  const { key } = req.params
  const exists = db.get('projects').find({ key }).value()
  if (!exists) return res.status(404).json({ error: 'Project not found' })

  db.get('projects').remove({ key }).write()
  db.get('pinned_initiatives').remove({ project_key: key }).write()
  res.json({ deleted: key })
})

module.exports = router
