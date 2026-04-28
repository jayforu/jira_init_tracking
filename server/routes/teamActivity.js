const express = require('express')
const router = express.Router()
const db = require('../db')

const QA_ISSUETYPE = 'QA Sub-Task'

function emptyStats() {
  return { todo: 0, in_progress: 0, done: 0, total: 0 }
}

function emptyPRs() {
  return { open: 0, merged: 0, declined: 0, total: 0 }
}

function addToStats(stats, statusCategory) {
  const cat = (statusCategory || '').toLowerCase()
  if (cat === 'done') stats.done++
  else if (cat === 'in progress') stats.in_progress++
  else stats.todo++
  stats.total++
}

function addPR(prStats, pr) {
  const s = (pr.status || '').toUpperCase()
  if (s === 'OPEN') prStats.open++
  else if (s === 'MERGED') prStats.merged++
  else if (s === 'DECLINED') prStats.declined++
  prStats.total++
}

async function fetchStoriesAndSubtasks(jira, project, from, to) {
  const dateRange = `updated >= "${from}" AND updated <= "${to}"`
  const [stories, subtasks] = await Promise.all([
    jira.searchJQLAll(
      `project = "${project}" AND issuetype not in subTaskIssueTypes() AND issuetype not in (Epic, Initiative) AND ${dateRange} ORDER BY updated DESC`,
      ['summary', 'status', 'assignee', 'issuetype']
    ),
    jira.searchJQLAll(
      `project = "${project}" AND issuetype in subTaskIssueTypes() AND ${dateRange} ORDER BY updated DESC`,
      ['summary', 'status', 'assignee', 'issuetype']
    )
  ])
  return { stories, subtasks }
}

// Run at most `limit` async tasks concurrently
async function pooledMap(items, limit, fn) {
  const results = []
  let idx = 0
  async function worker() {
    while (idx < items.length) {
      const i = idx++
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// GET /api/team-activity?project=X&from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns stories + subtasks only — fast
router.get('/', async (req, res) => {
  const { project, from, to } = req.query
  if (!project || !from || !to) {
    return res.status(400).json({ error: 'project, from and to params required' })
  }

  try {
    const { stories, subtasks } = await fetchStoriesAndSubtasks(req.jira, project, from, to)

    const qaSubtasks  = subtasks.filter(i => i.fields.issuetype?.name === QA_ISSUETYPE)
    const devSubtasks = subtasks.filter(i => i.fields.issuetype?.name !== QA_ISSUETYPE)

    const storyMap = {}
    for (const s of stories) {
      const key = s.fields.assignee?.displayName || 'Unassigned'
      if (!storyMap[key]) storyMap[key] = { name: key, stats: emptyStats() }
      addToStats(storyMap[key].stats, s.fields.status?.statusCategory?.name)
    }

    const devSubtaskMap = {}
    for (const s of devSubtasks) {
      const key = s.fields.assignee?.displayName || 'Unassigned'
      if (!devSubtaskMap[key]) devSubtaskMap[key] = { name: key, stats: emptyStats() }
      addToStats(devSubtaskMap[key].stats, s.fields.status?.statusCategory?.name)
    }

    const qaSubtaskMap = {}
    for (const s of qaSubtasks) {
      const key = s.fields.assignee?.displayName || 'Unassigned'
      if (!qaSubtaskMap[key]) qaSubtaskMap[key] = { name: key, stats: emptyStats() }
      addToStats(qaSubtaskMap[key].stats, s.fields.status?.statusCategory?.name)
    }

    const sortByTotal = arr => arr.sort((a, b) => b.stats.total - a.stats.total)

    res.json({
      period: { from, to },
      stories:      sortByTotal(Object.values(storyMap)),
      dev_subtasks: sortByTotal(Object.values(devSubtaskMap)),
      qa_subtasks:  sortByTotal(Object.values(qaSubtaskMap))
    })
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.errorMessages?.[0] || e.message })
  }
})

// GET /api/team-activity/prs?project=X&from=YYYY-MM-DD&to=YYYY-MM-DD
// Reads from synced DB — instant, no live API calls
router.get('/prs', (req, res) => {
  const { project, from, to } = req.query
  if (!project || !from || !to) {
    return res.status(400).json({ error: 'project, from and to params required' })
  }

  const dateFrom = new Date(from)
  const dateTo   = new Date(to)
  dateTo.setHours(23, 59, 59, 999)

  const devData = db.get('story_dev_data').filter({ project_key: project }).value()

  const prMap = {}
  for (const d of devData) {
    for (const pr of (d.prs || [])) {
      const created = pr.created_at ? new Date(pr.created_at) : null
      if (!created || created < dateFrom || created > dateTo) continue
      const author = pr.author || 'Unknown'
      if (!prMap[author]) prMap[author] = { name: author, prs: emptyPRs() }
      addPR(prMap[author].prs, pr)
    }
  }

  const sortByPRTotal = arr => arr.sort((a, b) => b.prs.total - a.prs.total)
  res.json({ period: { from, to }, prs_by_author: sortByPRTotal(Object.values(prMap)) })
})

// GET /api/team-activity/commits?project=X&from=YYYY-MM-DD&to=YYYY-MM-DD
// Reads from synced DB — instant, no live API calls
router.get('/commits', (req, res) => {
  const { project, from, to } = req.query
  if (!project || !from || !to) {
    return res.status(400).json({ error: 'project, from and to params required' })
  }

  const dateFrom = new Date(from)
  const dateTo   = new Date(to)
  dateTo.setHours(23, 59, 59, 999)

  const devData = db.get('story_dev_data').filter({ project_key: project }).value()

  const commitMap = {}
  for (const d of devData) {
    for (const c of (d.commits || [])) {
      if (c.merge) continue
      if (!c.author || c.author.includes('@') || c.author.toLowerCase().includes('bot')) continue
      const ts = c.timestamp ? new Date(c.timestamp) : null
      if (!ts || ts < dateFrom || ts > dateTo) continue
      if (!commitMap[c.author]) commitMap[c.author] = { name: c.author, commits: 0, files_changed: 0 }
      commitMap[c.author].commits++
      commitMap[c.author].files_changed += c.file_count
    }
  }

  const sorted = Object.values(commitMap).sort((a, b) => b.commits - a.commits)
  res.json({ period: { from, to }, commits_by_author: sorted })
})

module.exports = router
