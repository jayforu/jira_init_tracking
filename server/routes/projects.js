const express = require('express')
const router = express.Router()
const db = require('../db')
const { JiraClient } = require('@local/jira-client')

function getClient() {
  return new JiraClient({
    host: process.env.JIRA_HOST,
    email: process.env.JIRA_EMAIL,
    token: process.env.JIRA_TOKEN
  })
}

router.get('/', (req, res) => {
  res.json(db.get('projects').value())
})

router.post('/', async (req, res) => {
  const { key, name } = req.body
  if (!key || !name) return res.status(400).json({ error: 'key and name are required' })

  const upperKey = key.toUpperCase()

  try {
    await getClient().getProject(upperKey)
  } catch {
    return res.status(404).json({ error: `Project "${upperKey}" not found in Jira` })
  }

  const exists = db.get('projects').find({ key: upperKey }).value()
  if (exists) return res.status(409).json({ error: `Project "${upperKey}" is already configured` })

  const project = { key: upperKey, name, created_at: new Date().toISOString() }
  db.get('projects').push(project).write()
  res.status(201).json(project)
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
