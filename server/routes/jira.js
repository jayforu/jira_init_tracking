const express = require('express')
const router = express.Router()
const { JiraClient } = require('@local/jira-client')

function getClient() {
  return new JiraClient({
    host: process.env.JIRA_HOST,
    email: process.env.JIRA_EMAIL,
    token: process.env.JIRA_TOKEN
  })
}

const TEST_STATUS_MAP = {
  passed: 'pass', done: 'pass',
  failed: 'fail',
  'in progress': 'wip', executing: 'wip',
  'to do': 'notrun', open: 'notrun'
}

function mapTestStatus(statusName) {
  return TEST_STATUS_MAP[statusName.toLowerCase()] || 'notrun'
}

router.get('/initiatives', async (req, res) => {
  const { project, includeDone } = req.query
  if (!project) return res.status(400).json({ error: 'project param required' })

  const donePart = includeDone === 'true' ? '' : ' AND statusCategory != Done'
  const jql = `project = ${project} AND issuetype = Initiative${donePart} ORDER BY created DESC`

  try {
    const issues = await getClient().searchJQL(jql, ['summary', 'status', 'assignee'])
    res.json(issues.map(i => ({
      key: i.key,
      summary: i.fields.summary,
      status: i.fields.status?.name,
      statusCategory: i.fields.status?.statusCategory?.name,
      assignee: i.fields.assignee?.displayName || null
    })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/epics', async (req, res) => {
  const { parent } = req.query
  if (!parent) return res.status(400).json({ error: 'parent param required' })

  const jql = `parent = ${parent} AND issuetype = Epic ORDER BY created ASC`

  try {
    const issues = await getClient().searchJQL(jql, ['summary', 'status', 'assignee', 'customfield_10014'])
    res.json(issues.map(i => ({
      key: i.key,
      summary: i.fields.summary,
      status: i.fields.status?.name,
      statusCategory: i.fields.status?.statusCategory?.name,
      assignee: i.fields.assignee?.displayName || null
    })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/subtasks', async (req, res) => {
  const { parent } = req.query
  if (!parent) return res.status(400).json({ error: 'parent param required' })

  const jql = `parent = ${parent} AND issuetype in (Story, Sub-task, Task)`

  try {
    const issues = await getClient().searchJQL(jql, ['summary', 'status'])
    const total = issues.length
    const done = issues.filter(i => i.fields.status?.statusCategory?.name === 'Done').length
    res.json({ total, done })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/tests', async (req, res) => {
  const { epicKey } = req.query
  if (!epicKey) return res.status(400).json({ error: 'epicKey param required' })

  try {
    const links = await getClient().getIssueLinks(epicKey)
    const testKeys = links
      .filter(l => {
        const linked = l.inwardIssue || l.outwardIssue
        return linked?.fields?.issuetype?.name === 'Test'
      })
      .map(l => (l.inwardIssue || l.outwardIssue).key)

    if (!testKeys.length) return res.json({ total: 0, pass: 0, fail: 0, wip: 0, notrun: 0, tests: [] })

    const jql = `key in (${testKeys.join(',')})`
    const issues = await getClient().searchJQL(jql, ['summary', 'status'])

    const counts = { pass: 0, fail: 0, wip: 0, notrun: 0 }
    const tests = issues.map(i => {
      const mapped = mapTestStatus(i.fields.status?.name || '')
      counts[mapped]++
      return { key: i.key, summary: i.fields.summary, status: i.fields.status?.name, mapped }
    })

    res.json({ total: issues.length, ...counts, tests })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
