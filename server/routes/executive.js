const express = require('express')
const router = express.Router()
const db = require('../db')

// GET /api/executive?project=X&includeDone=true
// project=ALL returns pinned initiatives across every configured project
router.get('/', (req, res) => {
  const { project, includeDone } = req.query
  if (!project) return res.status(400).json({ error: 'project param required' })

  const allProjects = db.get('projects').value()
  const projectKeys = project === 'ALL' ? allProjects.map(p => p.key) : [project]
  const projectNameMap = Object.fromEntries(allProjects.map(p => [p.key, p.name]))

  const allPinned = db.get('pinned_initiatives')
    .filter(p => projectKeys.includes(p.project_key))
    .value()
  const pinnedSet = new Set(allPinned.map(p => p.initiative_key))

  let initiatives = db.get('initiatives')
    .filter(i => projectKeys.includes(i.project_key) && pinnedSet.has(i.key))
    .value()

  if (includeDone !== 'true') {
    initiatives = initiatives.filter(i => i.statusCategory !== 'Done')
  }

  const enriched = initiatives.map(init => {
    const epics = db.get('epics').filter({ initiative_key: init.key }).value()

    const epicCount = epics.length
    const blockedEpics = epics.filter(e => e.health === 'Blocked').length
    const atRiskEpics = epics.filter(e => e.health === 'At Risk').length
    const goodEpics = epics.filter(e => e.health === 'Good' || e.health === 'Done').length

    const devEpics = epics.filter(e => (e.subtasks?.total || 0) > 0)
    const devPercent = devEpics.length > 0
      ? Math.round(devEpics.reduce((sum, e) => sum + (e.subtasks.done / e.subtasks.total), 0) / devEpics.length * 100)
      : 0

    const testTotal = epics.reduce((sum, e) => sum + (e.tests?.total || 0), 0)
    const testPass  = epics.reduce((sum, e) => sum + (e.tests?.pass  || 0), 0)
    const testFail  = epics.reduce((sum, e) => sum + (e.tests?.fail  || 0), 0)
    const testPassRate = testTotal > 0 ? Math.round(testPass / testTotal * 100) : null

    let health = init.health || 'N/A'
    if (epicCount > 0) {
      if (blockedEpics > 0) health = 'Blocked'
      else if (atRiskEpics > 0) health = 'At Risk'
      else if (goodEpics === epicCount) health = 'Good'
      else health = 'At Risk'
    }

    return {
      key: init.key,
      project_key: init.project_key,
      project_name: projectNameMap[init.project_key] || init.project_key,
      summary: init.summary,
      status: init.status,
      statusCategory: init.statusCategory,
      assignee: init.assignee,
      synced_at: init.synced_at,
      health,
      epicCount,
      blockedEpics,
      atRiskEpics,
      goodEpics,
      devPercent,
      testPassRate,
      testTotal,
      testPass,
      testFail,
    }
  })

  // Sort: Blocked first, then At Risk, then others
  const order = { Blocked: 0, 'At Risk': 1, Good: 2, Done: 3, 'N/A': 4 }
  enriched.sort((a, b) => (order[a.health] ?? 5) - (order[b.health] ?? 5))

  res.json(enriched)
})

module.exports = router
