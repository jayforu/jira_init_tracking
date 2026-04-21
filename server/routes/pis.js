const express = require('express')
const router = express.Router()
const db = require('../db')

// Static routes must come before /:id

// GET /api/pis/assignments — flat list of all pi_initiatives joined with PI name
router.get('/assignments', (req, res) => {
  const pis = db.get('pis').value()
  const piMap = {}
  pis.forEach(p => { piMap[p.id] = p })

  const assignments = db.get('pi_initiatives').value().map(a => ({
    pi_id: a.pi_id,
    pi_name: piMap[a.pi_id]?.name || a.pi_id,
    initiative_key: a.initiative_key,
    project_key: a.project_key,
    spilled_over: a.spilled_over || false
  }))
  res.json(assignments)
})

// GET /api/pis — list all PIs sorted newest first
router.get('/', (req, res) => {
  const pis = db.get('pis').sortBy('start_date').reverse().value()
  res.json(pis)
})

// POST /api/pis — create PI
router.post('/', (req, res) => {
  const { name, start_date, end_date } = req.body
  if (!name || !start_date || !end_date)
    return res.status(400).json({ error: 'name, start_date, and end_date are required' })

  const pi = { id: `pi-${Date.now()}`, name, start_date, end_date, created_at: new Date().toISOString() }
  db.get('pis').push(pi).write()
  res.status(201).json(pi)
})

// PATCH /api/pis/:id — update PI
router.patch('/:id', (req, res) => {
  const pi = db.get('pis').find({ id: req.params.id }).value()
  if (!pi) return res.status(404).json({ error: 'PI not found' })

  const updates = {}
  for (const f of ['name', 'start_date', 'end_date']) {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  }
  db.get('pis').find({ id: req.params.id }).assign(updates).write()
  res.json(db.get('pis').find({ id: req.params.id }).value())
})

// DELETE /api/pis/:id — delete PI and cascade assignments
router.delete('/:id', (req, res) => {
  if (!db.get('pis').find({ id: req.params.id }).value())
    return res.status(404).json({ error: 'PI not found' })

  db.get('pis').remove({ id: req.params.id }).write()
  db.get('pi_initiatives').remove({ pi_id: req.params.id }).write()
  db.get('pi_epics').remove({ pi_id: req.params.id }).write()
  res.json({ deleted: req.params.id })
})

// GET /api/pis/:id/board — full board data (PI + enriched initiatives + standalone epics)
router.get('/:id/board', (req, res) => {
  const pi = db.get('pis').find({ id: req.params.id }).value()
  if (!pi) return res.status(404).json({ error: 'PI not found' })

  const assignments = db.get('pi_initiatives').filter({ pi_id: req.params.id }).value()

  const initiatives = assignments.map(a => {
    const init = db.get('initiatives').find({ key: a.initiative_key }).value() || {}
    return {
      initiative_key: a.initiative_key,
      project_key: a.project_key,
      spilled_over: a.spilled_over || false,
      assigned_at: a.assigned_at,
      summary: init.summary || a.initiative_key,
      status: init.status || 'Unknown',
      statusCategory: init.statusCategory || 'Unknown',
      health: init.health || 'N/A',
      assignee: init.assignee || null
    }
  })

  const epicAssignments = db.get('pi_epics').filter({ pi_id: req.params.id }).value()
  const standalone_epics = epicAssignments.map(a => {
    const epic = db.get('epics').find({ key: a.epic_key }).value() || {}
    return {
      epic_key: a.epic_key,
      spilled_over: a.spilled_over || false,
      assigned_at: a.assigned_at,
      summary: epic.summary || a.epic_key,
      status: epic.status || 'Unknown',
      health: epic.health || 'N/A',
      assignee: epic.assignee || null,
      initiative_key: epic.initiative_key || null,
      project_key: epic.project_key || null
    }
  })

  res.json({ pi, initiatives, standalone_epics })
})

// GET /api/pis/:id/available — initiatives from DB not yet in this PI
router.get('/:id/available', (req, res) => {
  if (!db.get('pis').find({ id: req.params.id }).value())
    return res.status(404).json({ error: 'PI not found' })

  const assigned = db.get('pi_initiatives')
    .filter({ pi_id: req.params.id })
    .map('initiative_key')
    .value()

  const available = db.get('initiatives')
    .filter(i => !assigned.includes(i.key) && i.statusCategory !== 'Done')
    .value()

  res.json(available)
})

// POST /api/pis/:id/initiatives — assign initiative to PI
router.post('/:id/initiatives', (req, res) => {
  const { initiative_key, project_key } = req.body
  if (!initiative_key || !project_key)
    return res.status(400).json({ error: 'initiative_key and project_key are required' })

  if (!db.get('pis').find({ id: req.params.id }).value())
    return res.status(404).json({ error: 'PI not found' })

  const exists = db.get('pi_initiatives')
    .find({ pi_id: req.params.id, initiative_key })
    .value()
  if (exists) return res.status(409).json({ error: 'Initiative already assigned to this PI' })

  const assignment = {
    pi_id: req.params.id,
    initiative_key,
    project_key,
    spilled_over: false,
    assigned_at: new Date().toISOString()
  }
  db.get('pi_initiatives').push(assignment).write()
  res.status(201).json(assignment)
})

// DELETE /api/pis/:id/initiatives/:key — remove initiative from PI
router.delete('/:id/initiatives/:key', (req, res) => {
  const { id, key } = req.params
  if (!db.get('pi_initiatives').find({ pi_id: id, initiative_key: key }).value())
    return res.status(404).json({ error: 'Assignment not found' })

  db.get('pi_initiatives').remove({ pi_id: id, initiative_key: key }).write()
  res.json({ removed: key })
})

// PATCH /api/pis/:id/initiatives/:key — update assignment (spilled_over)
router.patch('/:id/initiatives/:key', (req, res) => {
  const { id, key } = req.params
  const assignment = db.get('pi_initiatives').find({ pi_id: id, initiative_key: key }).value()
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' })

  const updates = {}
  if (req.body.spilled_over !== undefined) updates.spilled_over = req.body.spilled_over

  db.get('pi_initiatives').find({ pi_id: id, initiative_key: key }).assign(updates).write()
  res.json(db.get('pi_initiatives').find({ pi_id: id, initiative_key: key }).value())
})

// GET /api/pis/:id/available-epics — epics not implicitly or explicitly in this PI
router.get('/:id/available-epics', (req, res) => {
  if (!db.get('pis').find({ id: req.params.id }).value())
    return res.status(404).json({ error: 'PI not found' })

  // Initiatives already in this PI — their epics are implicitly included
  const assignedInitiativeKeys = db.get('pi_initiatives')
    .filter({ pi_id: req.params.id })
    .map('initiative_key')
    .value()

  // Epics already explicitly assigned to this PI
  const assignedEpicKeys = db.get('pi_epics')
    .filter({ pi_id: req.params.id })
    .map('epic_key')
    .value()

  const available = db.get('epics')
    .filter(e =>
      !assignedInitiativeKeys.includes(e.initiative_key) &&
      !assignedEpicKeys.includes(e.key)
    )
    .value()

  res.json(available)
})

// POST /api/pis/:id/epics — explicitly assign an epic to a PI
router.post('/:id/epics', (req, res) => {
  const { epic_key } = req.body
  if (!epic_key) return res.status(400).json({ error: 'epic_key is required' })

  if (!db.get('pis').find({ id: req.params.id }).value())
    return res.status(404).json({ error: 'PI not found' })

  if (!db.get('epics').find({ key: epic_key }).value())
    return res.status(404).json({ error: 'Epic not found' })

  if (db.get('pi_epics').find({ pi_id: req.params.id, epic_key }).value())
    return res.status(409).json({ error: 'Epic already assigned to this PI' })

  const assignment = {
    pi_id: req.params.id,
    epic_key,
    spilled_over: false,
    assigned_at: new Date().toISOString()
  }
  db.get('pi_epics').push(assignment).write()
  res.status(201).json(assignment)
})

// DELETE /api/pis/:id/epics/:key — remove explicit epic assignment
router.delete('/:id/epics/:key', (req, res) => {
  const { id, key } = req.params
  if (!db.get('pi_epics').find({ pi_id: id, epic_key: key }).value())
    return res.status(404).json({ error: 'Assignment not found' })

  db.get('pi_epics').remove({ pi_id: id, epic_key: key }).write()
  res.json({ removed: key })
})

// PATCH /api/pis/:id/epics/:key — update epic assignment (spilled_over)
router.patch('/:id/epics/:key', (req, res) => {
  const { id, key } = req.params
  const assignment = db.get('pi_epics').find({ pi_id: id, epic_key: key }).value()
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' })

  const updates = {}
  if (req.body.spilled_over !== undefined) updates.spilled_over = req.body.spilled_over

  db.get('pi_epics').find({ pi_id: id, epic_key: key }).assign(updates).write()
  res.json(db.get('pi_epics').find({ pi_id: id, epic_key: key }).value())
})

module.exports = router
