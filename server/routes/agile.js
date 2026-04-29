const express = require('express')
const router = express.Router()

// GET /api/agile/boards?project=SCHED
router.get('/boards', async (req, res) => {
  const { project } = req.query
  if (!project) return res.status(400).json({ error: 'project param required' })
  try {
    const boards = await req.jira.getBoards(project)
    res.json(boards)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/agile/sprints?board=4610
router.get('/sprints', async (req, res) => {
  const { board } = req.query
  if (!board) return res.status(400).json({ error: 'board param required' })
  try {
    const sprints = await req.jira.getSprints(board)
    res.json(sprints)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
