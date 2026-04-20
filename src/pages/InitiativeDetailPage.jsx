import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useInitiativeDetail from '../hooks/useInitiativeDetail'
import EpicTable from '../components/EpicTable'
import HealthChip from '../components/HealthChip'
import SummaryBar from '../components/SummaryBar'

const JIRA_HOST = import.meta.env.VITE_JIRA_HOST || 'lmsportal.atlassian.net'

function initiativeHealth(epics) {
  if (!epics.length) return 'N/A'
  const hs = epics.map(e => e.health)
  if (hs.some(h => h === 'Blocked')) return 'Blocked'
  if (hs.every(h => h === 'Good')) return 'Done'
  if (hs.every(h => h === 'Good' || h === 'N/A')) return 'Good'
  return 'At Risk'
}

export default function InitiativeDetailPage() {
  const { key } = useParams()
  const navigate = useNavigate()
  const { epics, loading, error, reload } = useInitiativeDetail(key)

  const health = initiativeHealth(epics)
  const totalSubtasksDone = epics.reduce((s, e) => s + (e.subtasks?.done || 0), 0)
  const totalSubtasks = epics.reduce((s, e) => s + (e.subtasks?.total || 0), 0)
  const totalTestPass = epics.reduce((s, e) => s + (e.tests?.pass || 0), 0)
  const totalTests = epics.reduce((s, e) => s + (e.tests?.total || 0), 0)
  const passRate = totalTests > 0 ? Math.round((totalTestPass / totalTests) * 100) : 0
  const devPct = totalSubtasks > 0 ? Math.round((totalSubtasksDone / totalSubtasks) * 100) : 0

  const summaryStats = [
    { label: 'Epics', value: epics.length },
    { label: 'Avg Dev', value: `${devPct}%` },
    { label: 'Test Cases', value: totalTests },
    { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 90 ? 'good' : passRate >= 50 ? 'risk' : 'block' },
    { label: 'Blocked', value: epics.filter(e => e.health === 'Blocked').length, color: 'block' },
    { label: 'At Risk', value: epics.filter(e => e.health === 'At Risk').length, color: 'risk' },
    { label: 'Good', value: epics.filter(e => e.health === 'Good').length, color: 'good' }
  ]

  return (
    <div className="page">
      <div className="detail-header">
        <div className="breadcrumb">
          <Link to="/">← Initiatives</Link>
        </div>
        <div className="detail-header__top">
          <div style={{ flex: 1 }}>
            <h1 className="detail-header__title">{key}</h1>
            <span className="detail-header__key">{key}</span>
          </div>
          <HealthChip health={health} />
          <a
            href={`https://${JIRA_HOST}/browse/${key}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn--ghost btn--sm"
          >
            ↗ Open in Jira
          </a>
          <button className="btn btn--ghost btn--sm" onClick={reload}>↺ Refresh</button>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <EpicTable epics={epics} jiraHost={JIRA_HOST} loading={loading} />

      <SummaryBar label={key} stats={summaryStats} />
    </div>
  )
}
