const express = require('express')
const router = express.Router()

const QA_ISSUETYPE = 'QA Sub-Task'
const TRENDS_TTL = 10 * 60 * 1000  // 10 minutes
const trendsCache = new Map()

function getCachedTrends(key) {
  const e = trendsCache.get(key)
  if (!e || e.expires < Date.now()) { trendsCache.delete(key); return null }
  return e.data
}
function setCachedTrends(key, data) {
  trendsCache.set(key, { data, expires: Date.now() + TRENDS_TTL })
}

function generateMonthList(from, to) {
  const months = []
  let d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1))
  const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1))
  while (d <= end) {
    months.push(d.toISOString().slice(0, 7))
    d.setUTCMonth(d.getUTCMonth() + 1)
  }
  return months
}

function emptyStats() { return { todo: 0, in_progress: 0, done: 0, total: 0 } }
function emptyPRs()   { return { open: 0, merged: 0, declined: 0, total: 0 } }

function categoryKey(statusCategory) {
  const cat = (statusCategory || '').toLowerCase()
  if (cat === 'done') return 'done'
  if (cat === 'in progress') return 'in_progress'
  return 'todo'
}

function addToStats(stats, statusCategory) {
  stats[categoryKey(statusCategory)]++
  stats.total++
}

function addPR(prStats, pr) {
  const s = (pr.status || '').toUpperCase()
  if (s === 'OPEN') prStats.open++
  else if (s === 'MERGED') prStats.merged++
  else if (s === 'DECLINED') prStats.declined++
  prStats.total++
}

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

// Resolve a comma-separated quickFilterIds query param to the list of JQL
// snippets that need to be AND-combined. Unknown/missing IDs are silently
// dropped so a stale query string never widens the scope.
async function resolveQuickFilterJQLs(jira, boardId, quickFilterIds) {
  if (!quickFilterIds) return []
  const wanted = String(quickFilterIds).split(',').map(s => s.trim()).filter(Boolean)
  if (!wanted.length) return []
  const all = await jira.getBoardQuickFilters(boardId)
  const byId = new Map(all.map(qf => [String(qf.id), qf]))
  return wanted.map(id => byId.get(id)?.jql).filter(Boolean)
}

// Build the JQL scope from boardId + optional sprint/date filter + selected quick filters
async function buildScopeJQL(jira, { boardId, sprintId, from, to, quickFilterJQLs = [] }) {
  const boardJQL = await jira.getBoardFilterJQL(boardId)
  if (!boardJQL) throw new Error('Could not fetch board filter')

  // Strip ORDER BY from board JQL — we'll add our own
  const cleanBoardJQL = boardJQL.replace(/\s+ORDER\s+BY\s+.*$/i, '').trim()

  let scope = `(${cleanBoardJQL})`
  for (const qf of quickFilterJQLs) {
    scope += ` AND (${qf.replace(/\s+ORDER\s+BY\s+.*$/i, '').trim()})`
  }
  if (sprintId) {
    scope += ` AND sprint = ${sprintId}`
  } else if (from && to) {
    scope += ` AND updated >= "${from}" AND updated <= "${to}"`
  }
  return scope
}

// Run a JQL search and bucket the results by issue type
async function searchAndSplit(jira, scopeJQL) {
  const all = await jira.searchJQLAll(
    `${scopeJQL} ORDER BY updated DESC`,
    ['summary', 'status', 'assignee', 'issuetype', 'parent']
  )

  const initiativesOnBoard = all.filter(i => i.fields.issuetype?.name === 'Initiative')
  const epics       = all.filter(i => i.fields.issuetype?.name === 'Epic')
  const qaSubtasks  = all.filter(i => i.fields.issuetype?.name === QA_ISSUETYPE)
  const devSubtasks = all.filter(i => i.fields.issuetype?.subtask && i.fields.issuetype?.name !== QA_ISSUETYPE)
  const stories     = all.filter(i => {
    const t = i.fields.issuetype
    return t?.name !== 'Initiative' && t?.name !== 'Epic' && !t?.subtask && t?.name !== QA_ISSUETYPE
  })

  return { all, initiativesOnBoard, epics, stories, devSubtasks, qaSubtasks }
}

// Add parent-initiatives of in-scope epics that aren't already on the board
async function expandInitiativesWithParents(jira, initiativesOnBoard, epics) {
  const onBoardKeys = new Set(initiativesOnBoard.map(i => i.key))
  const parentKeys = [...new Set(
    epics.map(e => e.fields.parent?.key).filter(k => k && !onBoardKeys.has(k))
  )]
  const parents = parentKeys.length
    ? await jira.searchJQLAll(
        `key in (${parentKeys.join(',')}) AND issuetype = Initiative`,
        ['summary', 'status', 'assignee']
      )
    : []
  return [...initiativesOnBoard, ...parents]
}

// GET /api/team-activity?boardId=X[&sprintId=Y][&from=...&to=...]
//   - Initiatives/Epics/Stories ALWAYS come from the board (no date filter)
//   - Subtasks honor the sprint or date filter when provided; otherwise board-wide
router.get('/', async (req, res) => {
  const { boardId, sprintId, from, to, quickFilterIds } = req.query
  if (!boardId) return res.status(400).json({ error: 'boardId required' })

  try {
    const quickFilterJQLs = await resolveQuickFilterJQLs(req.jira, boardId, quickFilterIds)

    // Top-level (board-wide) for initiatives/epics/stories — quick filters still apply
    const boardScope = await buildScopeJQL(req.jira, { boardId, quickFilterJQLs })
    const board = await searchAndSplit(req.jira, boardScope)
    const initiatives = await expandInitiativesWithParents(req.jira, board.initiativesOnBoard, board.epics)

    // Subtasks: re-query with sprint/date filter when provided
    let { devSubtasks, qaSubtasks } = board
    if (sprintId || (from && to)) {
      const filteredScope = await buildScopeJQL(req.jira, { boardId, sprintId, from, to, quickFilterJQLs })
      const filtered = await searchAndSplit(req.jira, filteredScope)
      devSubtasks = filtered.devSubtasks
      qaSubtasks = filtered.qaSubtasks
    }

    const epics   = board.epics
    const stories = board.stories

    const baseUrl = req.jira.siteUrl
    const buildMap = items => {
      const m = {}
      for (const s of items) {
        const key = s.fields.assignee?.displayName || 'Unassigned'
        if (!m[key]) m[key] = { name: key, stats: emptyStats(), items: [] }
        const cat = categoryKey(s.fields.status?.statusCategory?.name)
        m[key].stats[cat]++
        m[key].stats.total++
        m[key].items.push({
          key: s.key,
          summary: s.fields.summary,
          status: s.fields.status?.name,
          category: cat,
          url: baseUrl ? `${baseUrl}/browse/${s.key}` : null
        })
      }
      return m
    }

    const sortByTotal = arr => arr.sort((a, b) => b.stats.total - a.stats.total)

    res.json({
      initiatives:  sortByTotal(Object.values(buildMap(initiatives))),
      epics:        sortByTotal(Object.values(buildMap(epics))),
      stories:      sortByTotal(Object.values(buildMap(stories))),
      dev_subtasks: sortByTotal(Object.values(buildMap(devSubtasks))),
      qa_subtasks:  sortByTotal(Object.values(buildMap(qaSubtasks)))
    })
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.errorMessages?.[0] || e.message })
  }
})

// GET /api/team-activity/prs?boardId=X[&sprintId=Y][&from=...&to=...][&quickFilterIds=...]
router.get('/prs', async (req, res) => {
  const { boardId, sprintId, from, to, quickFilterIds } = req.query
  if (!boardId) return res.status(400).json({ error: 'boardId required' })

  try {
    const quickFilterJQLs = await resolveQuickFilterJQLs(req.jira, boardId, quickFilterIds)
    const scope = await buildScopeJQL(req.jira, { boardId, sprintId, from, to, quickFilterJQLs })
    const { all } = await searchAndSplit(req.jira, scope)

    const prResults = await pooledMap(all, 10, i => req.jira.getPRsForIssue(i.id))

    const prMap = {}
    for (let i = 0; i < all.length; i++) {
      const issueKey = all[i].key
      for (const pr of prResults[i]) {
        const author = pr.author || 'Unknown'
        if (!prMap[author]) prMap[author] = { name: author, prs: emptyPRs(), items: [] }
        addPR(prMap[author].prs, pr)
        prMap[author].items.push({
          title: pr.title,
          status: pr.status,
          url: pr.url,
          last_update: pr.last_update,
          issue_key: issueKey
        })
      }
    }

    const sorted = Object.values(prMap).sort((a, b) => b.prs.total - a.prs.total)
    res.json({ prs_by_author: sorted })
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.errorMessages?.[0] || e.message })
  }
})

// GET /api/team-activity/commits?boardId=X[&sprintId=Y][&from=...&to=...][&quickFilterIds=...]
router.get('/commits', async (req, res) => {
  const { boardId, sprintId, from, to, quickFilterIds } = req.query
  if (!boardId) return res.status(400).json({ error: 'boardId required' })

  const dateFrom = from ? new Date(from) : null
  const dateTo   = to ? new Date(to) : null
  if (dateTo) dateTo.setUTCHours(23, 59, 59, 999)

  try {
    const quickFilterJQLs = await resolveQuickFilterJQLs(req.jira, boardId, quickFilterIds)
    const scope = await buildScopeJQL(req.jira, { boardId, sprintId, from, to, quickFilterJQLs })
    const { all } = await searchAndSplit(req.jira, scope)

    const commitResults = await pooledMap(all, 10, i => req.jira.getCommitsForIssue(i.id))

    const commitMap = {}
    for (let i = 0; i < all.length; i++) {
      const issueKey = all[i].key
      for (const c of commitResults[i]) {
        if (c.merge) continue
        if (!c.author || c.author.includes('@') || c.author.toLowerCase().includes('bot')) continue
        if (dateFrom && dateTo) {
          const ts = c.timestamp ? new Date(c.timestamp) : null
          if (!ts || ts < dateFrom || ts > dateTo) continue
        }
        if (!commitMap[c.author]) commitMap[c.author] = { name: c.author, commits: 0, files_changed: 0, items: [] }
        commitMap[c.author].commits++
        commitMap[c.author].files_changed += c.file_count
        commitMap[c.author].items.push({
          id: c.id,
          message: c.message,
          url: c.url,
          repo: c.repo,
          timestamp: c.timestamp,
          file_count: c.file_count,
          issue_key: issueKey
        })
      }
    }

    const sorted = Object.values(commitMap).sort((a, b) => b.commits - a.commits)
    res.json({ commits_by_author: sorted })
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.errorMessages?.[0] || e.message })
  }
})

// GET /api/team-activity/trends?boardId=X&from=YYYY-MM-DD&to=YYYY-MM-DD[&quickFilterIds=...]
// Aggregates commits / files / PRs by person × month for the given range
router.get('/trends', async (req, res) => {
  const { boardId, from, to, quickFilterIds } = req.query
  if (!boardId || !from || !to) {
    return res.status(400).json({ error: 'boardId, from and to params required' })
  }

  const cacheKey = `${boardId}:${from}:${to}:${quickFilterIds || ''}`
  const cached = getCachedTrends(cacheKey)
  if (cached) return res.json({ ...cached, cached: true })

  const dateFrom = new Date(from)
  const dateTo   = new Date(to)
  dateTo.setUTCHours(23, 59, 59, 999)
  const months = generateMonthList(dateFrom, dateTo)
  const monthIdx = Object.fromEntries(months.map((m, i) => [m, i]))

  try {
    const quickFilterJQLs = await resolveQuickFilterJQLs(req.jira, boardId, quickFilterIds)
    const scope = await buildScopeJQL(req.jira, { boardId, from, to, quickFilterJQLs })
    const { all } = await searchAndSplit(req.jira, scope)

    // Fetch PRs + commits in parallel per issue, pooled at 20 concurrent
    const results = await pooledMap(all, 20, async issue => {
      const [prs, commits] = await Promise.all([
        req.jira.getPRsForIssue(issue.id),
        req.jira.getCommitsForIssue(issue.id)
      ])
      return { prs, commits }
    })

    const commitsByPerson = {}
    const filesByPerson   = {}
    const prsByPerson     = {}
    const ensureRow = (map, name) => {
      if (!map[name]) map[name] = { name, counts: months.map(() => 0), total: 0 }
      return map[name]
    }

    for (let i = 0; i < all.length; i++) {
      const { prs, commits } = results[i]

      for (const c of commits) {
        if (c.merge) continue
        if (!c.author || c.author.includes('@') || c.author.toLowerCase().includes('bot')) continue
        const ts = c.timestamp ? new Date(c.timestamp) : null
        if (!ts || ts < dateFrom || ts > dateTo) continue
        const idx = monthIdx[ts.toISOString().slice(0, 7)]
        if (idx === undefined) continue

        const cRow = ensureRow(commitsByPerson, c.author)
        cRow.counts[idx]++
        cRow.total++
        const fRow = ensureRow(filesByPerson, c.author)
        fRow.counts[idx] += c.file_count
        fRow.total += c.file_count
      }

      for (const pr of prs) {
        const author = pr.author || 'Unknown'
        const ts = pr.last_update ? new Date(pr.last_update) : null
        if (!ts || ts < dateFrom || ts > dateTo) continue
        const idx = monthIdx[ts.toISOString().slice(0, 7)]
        if (idx === undefined) continue

        const row = ensureRow(prsByPerson, author)
        row.counts[idx]++
        row.total++
      }
    }

    const sortByTotal = m => Object.values(m).sort((a, b) => b.total - a.total)

    const data = {
      months,
      commits: sortByTotal(commitsByPerson),
      files:   sortByTotal(filesByPerson),
      prs:     sortByTotal(prsByPerson)
    }

    setCachedTrends(cacheKey, data)
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.errorMessages?.[0] || e.message })
  }
})

// GET /api/team-activity/quick-filters?boardId=X
// Returns the list of quick filters defined on the board so the UI can offer them.
router.get('/quick-filters', async (req, res) => {
  const { boardId } = req.query
  if (!boardId) return res.status(400).json({ error: 'boardId required' })
  try {
    const filters = await req.jira.getBoardQuickFilters(boardId)
    res.json({ quick_filters: filters })
  } catch (e) {
    res.status(500).json({ error: e.response?.data?.errorMessages?.[0] || e.message })
  }
})

module.exports = router
