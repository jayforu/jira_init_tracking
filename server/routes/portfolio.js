const express = require('express')
const router = express.Router()
const db = require('../db')

const EPIC_WEIGHT = 4

function piElapsedPct(pi) {
  const now = new Date()
  const start = new Date(pi.start_date)
  const end = new Date(pi.end_date)
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}

// GET /api/portfolio?pi=X&project=Y&includeDone=true
router.get('/', (req, res) => {
  const { pi: piId, project, includeDone } = req.query
  if (!piId) return res.status(400).json({ error: 'pi param required' })

  const pi = db.get('pis').find({ id: piId }).value()
  if (!pi) return res.status(404).json({ error: 'PI not found' })

  const allProjects = db.get('projects').value()
  const projectNameMap = Object.fromEntries(allProjects.map(p => [p.key, p.name]))

  const assignments = db.get('pi_initiatives').filter({ pi_id: piId }).value()

  const enriched = []
  const resourceMap = {}
  const unassignedEpics = []

  for (const a of assignments) {
    const init = db.get('initiatives').find({ key: a.initiative_key }).value() || {}

    if (project && project !== 'ALL' && init.project_key !== project) continue
    if (includeDone !== 'true' && init.statusCategory === 'Done') continue

    const epics = db.get('epics').filter({ initiative_key: a.initiative_key }).value()

    const epicCount = epics.length
    const blockedEpics = epics.filter(e => e.health === 'Blocked').length
    const atRiskEpics  = epics.filter(e => e.health === 'At Risk').length
    const goodEpics    = epics.filter(e => e.health === 'Good' || e.health === 'Done').length

    const devEpics = epics.filter(e => (e.subtasks?.total || 0) > 0)
    const devPercent = devEpics.length > 0
      ? Math.round(devEpics.reduce((s, e) => s + (e.subtasks.done / e.subtasks.total), 0) / devEpics.length * 100)
      : 0

    const testTotal    = epics.reduce((s, e) => s + (e.tests?.total || 0), 0)
    const testPass     = epics.reduce((s, e) => s + (e.tests?.pass  || 0), 0)
    const testFail     = epics.reduce((s, e) => s + (e.tests?.fail  || 0), 0)
    const testPassRate = testTotal > 0 ? Math.round(testPass / testTotal * 100) : null

    let health = 'N/A'
    if (epicCount > 0) {
      if (blockedEpics > 0)             health = 'Blocked'
      else if (atRiskEpics > 0)         health = 'At Risk'
      else if (goodEpics === epicCount)  health = 'Good'
      else                               health = 'At Risk'
    }

    enriched.push({
      key: a.initiative_key,
      project_key: init.project_key,
      project_name: projectNameMap[init.project_key] || init.project_key,
      summary: init.summary || a.initiative_key,
      status: init.status,
      statusCategory: init.statusCategory,
      assignee: init.assignee || null,
      spilled_over: a.spilled_over || false,
      health, epicCount, blockedEpics, atRiskEpics, goodEpics,
      devPercent, testPassRate, testTotal, testPass, testFail,
    })

    // Resource aggregation per epic
    for (const epic of epics) {
      const hasOwner   = !!epic.assignee
      const hasMembers = epic.members?.length > 0

      if (!hasOwner && !hasMembers) {
        unassignedEpics.push({
          key: epic.key,
          summary: epic.summary,
          health: epic.health,
          initiative_key: a.initiative_key,
          initiative_summary: init.summary,
          project_key: init.project_key,
        })
        continue
      }

      const ensurePerson = (name) => {
        if (!resourceMap[name]) {
          resourceMap[name] = {
            name,
            epics_owned: [],
            epics_contributing: [],
            stories_total: 0,
            stories_done: 0,
            initiatives: new Set(),
          }
        }
        return resourceMap[name]
      }

      // Epic owner: always count the epic regardless of members data
      if (hasOwner) {
        const owner = ensurePerson(epic.assignee)
        if (!owner.epics_owned.find(e => e.key === epic.key)) {
          owner.epics_owned.push({
            key: epic.key,
            summary: epic.summary,
            health: epic.health,
            initiative_key: a.initiative_key,
            initiative_summary: init.summary,
            project_key: init.project_key,
          })
          owner.initiatives.add(init.project_key)
        }
      }

      if (hasMembers) {
        for (const m of epic.members) {
          const person = ensurePerson(m.name)
          person.stories_total += m.total
          person.stories_done  += m.done
          person.initiatives.add(init.project_key)

          // If this member is not the epic owner, track as contributing
          if (m.name !== epic.assignee) {
            if (!person.epics_contributing.find(e => e.key === epic.key)) {
              person.epics_contributing.push({
                key: epic.key,
                summary: epic.summary,
                health: epic.health,
                done: m.done,
                total: m.total,
                initiative_key: a.initiative_key,
                initiative_summary: init.summary,
                project_key: init.project_key,
              })
            }
          }
        }
      } else if (hasOwner) {
        // No members data — fall back to subtask totals for the owner
        const owner = resourceMap[epic.assignee]
        owner.stories_total += epic.subtasks?.total || 0
        owner.stories_done  += epic.subtasks?.done  || 0
      }
    }
  }

  const resources = Object.values(resourceMap).map(r => {
    const stories_open = r.stories_total - r.stories_done
    const load_score   = (r.epics_owned.length * EPIC_WEIGHT) + stories_open
    const load_level   = load_score >= 20 ? 'high' : load_score >= 8 ? 'medium' : 'low'
    return {
      name: r.name,
      epics_owned: r.epics_owned,
      epics_contributing: r.epics_contributing,
      stories_total: r.stories_total,
      stories_done: r.stories_done,
      stories_open,
      load_score,
      load_level,
      initiatives: [...r.initiatives],
    }
  }).sort((a, b) => b.load_score - a.load_score)

  const order = { Blocked: 0, 'At Risk': 1, Good: 2, Done: 3, 'N/A': 4 }
  enriched.sort((a, b) => (order[a.health] ?? 5) - (order[b.health] ?? 5))

  const elapsed = piElapsedPct(pi)

  res.json({
    pi: { ...pi, elapsed },
    initiatives: enriched,
    resources,
    unassigned_epics: unassignedEpics,
  })
})

module.exports = router
