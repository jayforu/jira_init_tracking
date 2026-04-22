const { JiraClient } = require('@local/jira-client')
const db = require('../db')
const { epicHealth } = require('./healthCalc')
const xray = require('./xrayClient')

const XRAY_ENABLED = !!(process.env.XRAY_CLIENT_ID && process.env.XRAY_CLIENT_SECRET)

function extractTestKeys(links) {
  // Xray tests link to stories with link type "Test" (inward: "is tested by")
  // From the story side, the test appears as inwardIssue
  return links
    .filter(l => l.type?.name === 'Test')
    .map(l => (l.inwardIssue || l.outwardIssue)?.key)
    .filter(Boolean)
}

const TEST_STATUS_MAP = {
  passed: 'pass', done: 'pass',
  failed: 'fail',
  'in progress': 'wip', executing: 'wip',
  'to do': 'notrun', open: 'notrun'
}
function mapTestStatus(name) {
  return TEST_STATUS_MAP[name?.toLowerCase()] || 'notrun'
}

async function syncProject(projectKey) {
  const auth = db.get('auth').value()
  if (!auth?.access_token) throw new Error('Not authenticated')

  const project = db.get('projects').find({ key: projectKey }).value()
  if (!project) throw new Error(`Project ${projectKey} not configured`)

  const jira = new JiraClient({ accessToken: auth.access_token, cloudId: auth.cloud_id })
  const testSource = project.test_source || 'epic'
  let xrayAvailable = XRAY_ENABLED  // may be toggled off per-run on auth failure

  db.get('sync_state').set(projectKey, { status: 'syncing', last_synced_at: null, error: null }).write()
  console.log(`[sync] Starting sync for ${projectKey} (test_source: ${testSource}, xray: ${xrayAvailable})`)

  try {
    // 1. Only fetch pinned initiatives for this project
    const pinnedKeys = db.get('pinned_initiatives')
      .filter({ project_key: projectKey })
      .map('initiative_key')
      .value()

    if (!pinnedKeys.length) {
      db.get('sync_state').set(projectKey, { status: 'idle', last_synced_at: new Date().toISOString(), error: null }).write()
      console.log(`[sync] No pinned initiatives for ${projectKey}, skipping`)
      return
    }

    const rawInitiatives = await jira.searchJQL(
      `key in (${pinnedKeys.join(',')}) AND issuetype = Initiative ORDER BY created DESC`,
      ['summary', 'status', 'assignee']
    )

    const initiatives = rawInitiatives.map(i => ({
      key: i.key,
      project_key: projectKey,
      summary: i.fields.summary,
      status: i.fields.status?.name,
      statusCategory: i.fields.status?.statusCategory?.name,
      assignee: i.fields.assignee?.displayName || null
    }))

    // 2. Fetch epics + subtasks + tests for each initiative
    const allEpics = []
    for (const initiative of initiatives) {
      const rawEpics = await jira.searchJQL(
        `parent = ${initiative.key} AND issuetype = Epic ORDER BY created ASC`,
        ['summary', 'status', 'assignee']
      )

      const enrichedEpics = []
      for (const epic of rawEpics) {
        let subtasks, testKeys = []

        let stories = []
        if (testSource === 'stories' || testSource === 'both') {
          stories = await jira.searchJQL(
            `parent = ${epic.key} AND issuetype not in (Epic, Initiative)`,
            ['status', 'issuelinks', 'assignee']
          )
          subtasks = {
            total: stories.length,
            done: stories.filter(i => i.fields.status?.statusCategory?.name === 'Done').length
          }
          for (const story of stories) {
            testKeys.push(...extractTestKeys(story.fields.issuelinks || []))
          }
          if (testSource === 'both') {
            const epicLinks = await jira.getIssueLinks(epic.key)
            testKeys.push(...extractTestKeys(epicLinks))
          }
          testKeys = [...new Set(testKeys)]
        } else {
          const [fetched, links] = await Promise.all([
            jira.searchJQL(
              `parent = ${epic.key} AND issuetype not in (Epic, Initiative)`,
              ['status', 'assignee']
            ),
            jira.getIssueLinks(epic.key)
          ])
          stories = fetched
          subtasks = {
            total: stories.length,
            done: stories.filter(i => i.fields.status?.statusCategory?.name === 'Done').length
          }
          testKeys = extractTestKeys(links)
        }

        // Aggregate child-item assignees
        const memberMap = {}
        for (const story of stories) {
          const name = story.fields.assignee?.displayName || null
          if (!name) continue
          if (!memberMap[name]) memberMap[name] = { total: 0, done: 0 }
          memberMap[name].total++
          if (story.fields.status?.statusCategory?.name === 'Done') memberMap[name].done++
        }
        const members = Object.entries(memberMap).map(([name, s]) => ({ name, ...s }))

        let tests = { total: 0, pass: 0, fail: 0, wip: 0, notrun: 0 }
        let xrayUsed = false

        if (XRAY_ENABLED && xrayAvailable && testKeys.length) {
          try {
            const xrayStats = await xray.getTestStatusesByKeys(testKeys)
            if (xrayStats) {
              tests = xrayStats
              xrayUsed = true
              console.log(`[xray] ${epic.key}: ${tests.total} tests — pass:${tests.pass} fail:${tests.fail} wip:${tests.wip} notrun:${tests.notrun}`)
            }
          } catch (err) {
            const msg = err.response?.data ? JSON.stringify(err.response.data) : err.message
            console.warn(`[xray] ${epic.key}: Xray query failed — ${msg}`)
            if (err.response?.status === 401 || err.response?.status === 403) {
              xrayAvailable = false
              xray.invalidateToken()
              console.warn('[xray] Disabling Xray for remainder of sync due to auth failure')
            }
          }
        }

        if (!xrayUsed && testKeys.length) {
          // Last resort: Jira workflow statuses for the test issue keys
          const testIssues = await jira.searchJQL(`key in (${testKeys.join(',')})`, ['status'])
          const counts = { pass: 0, fail: 0, wip: 0, notrun: 0 }
          testIssues.forEach(i => { counts[mapTestStatus(i.fields.status?.name)]++ })
          tests = { total: testIssues.length, ...counts }
        }

        const health = epicHealth({
          devStatus: epic.fields.status?.name,
          subtasksDone: subtasks.done,
          subtasksTotal: subtasks.total,
          testPass: tests.pass,
          testFail: tests.fail,
          testTotal: tests.total
        })

        enrichedEpics.push({
          key: epic.key,
          initiative_key: initiative.key,
          project_key: projectKey,
          summary: epic.fields.summary,
          status: epic.fields.status?.name,
          statusCategory: epic.fields.status?.statusCategory?.name,
          assignee: epic.fields.assignee?.displayName || null,
          subtasks,
          members,
          tests,
          health
        })
      }

      allEpics.push(...enrichedEpics)
    }

    // 3. Atomic write to DB — only replace pinned initiatives and their epics
    const now = new Date().toISOString()
    for (const key of pinnedKeys) {
      db.get('initiatives').remove({ key, project_key: projectKey }).write()
      db.get('epics').remove({ initiative_key: key, project_key: projectKey }).write()
    }
    if (initiatives.length) {
      db.get('initiatives').push(...initiatives.map(i => ({ ...i, synced_at: now }))).write()
    }
    if (allEpics.length) {
      db.get('epics').push(...allEpics.map(e => ({ ...e, synced_at: now }))).write()
    }

    db.get('sync_state').set(projectKey, { status: 'idle', last_synced_at: now, error: null }).write()
    console.log(`[sync] Done: ${projectKey} — ${initiatives.length} initiatives, ${allEpics.length} epics`)
  } catch (err) {
    const msg = err.response?.data?.errorMessages?.[0] || err.message
    db.get('sync_state').set(projectKey, { status: 'error', last_synced_at: null, error: msg }).write()
    console.error(`[sync] Failed for ${projectKey}:`, msg)
    throw err
  }
}

async function syncAll() {
  const projects = db.get('projects').value()
  for (const project of projects) {
    try { await syncProject(project.key) } catch { /* logged inside */ }
  }
}

function syncOnStartup() {
  syncAll()
}

module.exports = { syncProject, syncAll, syncOnStartup }
