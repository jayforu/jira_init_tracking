require('dotenv').config()
const axios = require('axios')

const XRAY_BASE = 'https://xray.cloud.getxray.app/api/v2'

const STATUS_MAP = {
  pass: 'pass', passed: 'pass',
  fail: 'fail', failed: 'fail',
  executing: 'wip',
  todo: 'notrun', aborted: 'notrun', blocked: 'notrun', unknown: 'notrun'
}

function mapStatus(name) {
  return STATUS_MAP[name?.toLowerCase()] || 'notrun'
}

let _token = null
let _tokenExpiry = 0

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token

  const { data } = await axios.post(`${XRAY_BASE}/authenticate`, {
    client_id: process.env.XRAY_CLIENT_ID,
    client_secret: process.env.XRAY_CLIENT_SECRET
  })
  _token = typeof data === 'string' ? data.replace(/"/g, '') : data
  _tokenExpiry = Date.now() + 55 * 60 * 1000
  console.log('[xray] Authenticated with Xray Cloud')
  return _token
}

function invalidateToken() {
  _token = null
  _tokenExpiry = 0
}

async function runGQL(query) {
  const token = await getToken()
  const { data } = await axios.post(
    `${XRAY_BASE}/graphql`,
    { query },
    { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
  )
  if (data.errors?.length) throw new Error(JSON.stringify(data.errors[0]) || 'Xray GraphQL error')
  return data.data
}

// PRIMARY STRATEGY: given Jira test-issue keys (from issue links), fetch latest run per test
async function getTestStatusesByKeys(jiraKeys) {
  if (!jiraKeys.length) return null

  // Xray GraphQL: query tests by their Jira keys, get the most recent run for each
  const jql = `key in (${jiraKeys.join(', ')})`
  const limit = Math.min(jiraKeys.length + 10, 200)

  const data = await runGQL(`{
    getTests(jql: "${jql}", limit: ${limit}) {
      total
      results {
        issueId
        testRuns(limit: 1) {
          total
          results {
            status { name }
          }
        }
      }
    }
  }`)

  const tests = data?.getTests?.results
  if (!tests?.length) return null

  const counts = { pass: 0, fail: 0, wip: 0, notrun: 0 }
  for (const test of tests) {
    const latestRun = test.testRuns?.results?.[0]
    counts[latestRun ? mapStatus(latestRun.status?.name) : 'notrun']++
  }

  return { total: tests.length, ...counts }
}

// FALLBACK STRATEGY: find test executions linked to an issue and aggregate runs
async function getTestStatusesForIssue(issueKey) {
  const data = await runGQL(`{
    getTestExecutions(jql: "issue in testExecutions(\\"${issueKey}\\")", limit: 50) {
      results {
        testRuns(limit: 500) {
          results {
            status { name }
            test { issueId }
          }
        }
      }
    }
  }`)

  const executions = data?.getTestExecutions?.results || []
  if (!executions.length) return null

  const latest = new Map()
  for (const exec of executions) {
    for (const run of exec.testRuns?.results || []) {
      if (run.test?.issueId) latest.set(run.test.issueId, run.status?.name)
    }
  }
  if (!latest.size) return null

  const counts = { pass: 0, fail: 0, wip: 0, notrun: 0 }
  for (const status of latest.values()) counts[mapStatus(status)]++
  return { total: latest.size, ...counts }
}

module.exports = { getTestStatusesByKeys, getTestStatusesForIssue, invalidateToken }
