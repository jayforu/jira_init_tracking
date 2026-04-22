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
    const issueKey = req.params.issueKey

    // Raw issue links with exact type names
    const issue = await req.jira.getIssue(issueKey, ['issuelinks', 'summary', 'issuetype', 'status'])
    const rawLinks = (issue.fields.issuelinks || []).map(l => ({
      id: l.id,
      typeName: l.type?.name,
      typeInward: l.type?.inward,
      typeOutward: l.type?.outward,
      inwardIssue: l.inwardIssue ? { key: l.inwardIssue.key, type: l.inwardIssue.fields?.issuetype?.name, status: l.inwardIssue.fields?.status?.name } : null,
      outwardIssue: l.outwardIssue ? { key: l.outwardIssue.key, type: l.outwardIssue.fields?.issuetype?.name, status: l.outwardIssue.fields?.status?.name } : null,
    }))

    // Fetch statuses of all linked issues (both directions) to see actual test statuses
    const allLinkedKeys = rawLinks.flatMap(l => [l.inwardIssue?.key, l.outwardIssue?.key].filter(Boolean))
    let linkedStatuses = {}
    if (allLinkedKeys.length) {
      const linked = await req.jira.searchJQL(
        `key in (${allLinkedKeys.join(',')})`,
        ['summary', 'status', 'issuetype']
      )
      linked.forEach(i => {
        linkedStatuses[i.key] = { type: i.fields.issuetype?.name, status: i.fields.status?.name, statusCategory: i.fields.status?.statusCategory?.name }
      })
    }

    // Stories under this epic and their test links
    let storyTestLinks = []
    try {
      const stories = await req.jira.searchJQL(
        `parent = ${issueKey} AND issuetype not in (Epic, Initiative)`,
        ['summary', 'issuelinks', 'status']
      )
      storyTestLinks = stories.map(s => ({
        key: s.key,
        summary: s.fields.summary,
        status: s.fields.status?.name,
        links: (s.fields.issuelinks || []).map(l => ({
          typeName: l.type?.name,
          typeInward: l.type?.inward,
          typeOutward: l.type?.outward,
          inwardKey: l.inwardIssue?.key,
          outwardKey: l.outwardIssue?.key,
        }))
      }))
    } catch (e) { storyTestLinks = [{ error: e.message }] }

    // JQL-based Xray probes
    const jqlResults = {}
    const tryJQL = async (label, jql) => {
      try {
        const issues = await req.jira.searchJQL(jql, ['summary', 'status', 'issuetype'])
        jqlResults[label] = { count: issues.length, items: issues.map(i => ({ key: i.key, type: i.fields.issuetype?.name, status: i.fields.status?.name })) }
      } catch (err) {
        jqlResults[label] = { error: err.response?.data?.errorMessages?.[0] || err.message }
      }
    }

    await Promise.all([
      tryJQL('xray_testExecutions',  `issue in testExecutions("${issueKey}")`),
      tryJQL('xray_testPlans',       `issue in testPlans("${issueKey}")`),
      tryJQL('linkedIssues_all',     `issue in linkedIssues("${issueKey}")`),
      tryJQL('issuetype_Test',       `issuetype = Test AND issue in linkedIssues("${issueKey}")`),
    ])

    const selfStatus = { status: issue.fields.status?.name, statusCategory: issue.fields.status?.statusCategory?.name, issueType: issue.fields.issuetype?.name }
    res.json({ key: issueKey, selfStatus, rawLinks, linkedStatuses, storyTestLinks, jqlResults })
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message })
  }
})

// GET /api/jira/test-statuses?keys=A,B,C — fetch actual Jira statuses for test issue keys
router.get('/test-statuses', async (req, res) => {
  const { keys } = req.query
  if (!keys) return res.status(400).json({ error: 'keys param required (comma-separated issue keys)' })
  try {
    const keyList = keys.split(',').map(k => k.trim()).filter(Boolean)
    const issues = await req.jira.searchJQL(
      `key in (${keyList.join(',')})`,
      ['summary', 'status', 'issuetype']
    )
    const result = issues.map(i => ({
      key: i.key,
      type: i.fields.issuetype?.name,
      status: i.fields.status?.name,
      statusCategory: i.fields.status?.statusCategory?.name
    }))
    const tally = result.reduce((acc, i) => { acc[i.status] = (acc[i.status] || 0) + 1; return acc }, {})
    res.json({ count: result.length, statusTally: tally, issues: result })
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message })
  }
})

module.exports = router
