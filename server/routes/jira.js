const express = require('express')
const router = express.Router()
const db = require('../db')

// GET /api/jira/initiatives?project=X&includeDone=true
router.get('/initiatives', (req, res) => {
  const { project, includeDone } = req.query
  if (!project) return res.status(400).json({ error: 'project param required' })

  let initiatives = db.get('initiatives').filter({ project_key: project }).value()
  if (includeDone !== 'true') {
    initiatives = initiatives.filter(i => i.statusCategory !== 'Done')
  }
  res.json(initiatives)
})

// GET /api/jira/epics?parent=X — returns epics pre-enriched with subtasks, tests, health
router.get('/epics', (req, res) => {
  const { parent } = req.query
  if (!parent) return res.status(400).json({ error: 'parent param required' })

  const epics = db.get('epics').filter({ initiative_key: parent }).value()
  res.json(epics)
})

// GET /api/jira/debug/:issueKey — inspect raw fields and issuelinks of any issue
router.get('/debug/:issueKey', async (req, res) => {
  try {
    const issue = await req.jira.getIssue(req.params.issueKey, [])
    const results = {}
    const tryJQL = async (label, jql) => {
      try {
        const issues = await req.jira.searchJQL(jql, ['summary', 'status', 'issuetype'])
        results[label] = { count: issues.length, items: issues.map(i => ({ key: i.key, type: i.fields.issuetype?.name, status: i.fields.status?.name })) }
      } catch (err) {
        results[label] = { error: err.response?.data?.errorMessages?.[0] || err.message }
      }
    }

    await Promise.all([
      tryJQL('xray_testExecutions',   `issue in testExecutions("${req.params.issueKey}")`),
      tryJQL('xray_testPlans',        `issue in testPlans("${req.params.issueKey}")`),
      tryJQL('issuetype_executions',  `issuetype = "Test Execution" AND issue in linkedIssues("${req.params.issueKey}")`),
    ])

    res.json({ key: req.params.issueKey, jqlResults: results })
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message })
  }
})

module.exports = router
