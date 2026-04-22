import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useInitiativeDetail from '../hooks/useInitiativeDetail'
import usePIAssignments from '../hooks/usePIAssignments'
import usePIs from '../hooks/usePIs'
import EpicTable from '../components/EpicTable'
import HealthChip from '../components/HealthChip'
import SummaryBar from '../components/SummaryBar'
import TeamWorkloadPanel from '../components/TeamWorkloadPanel'

const JIRA_HOST = import.meta.env.VITE_JIRA_HOST || 'lmsportal.atlassian.net'

function initiativeHealth(epics) {
  if (!epics.length) return 'N/A'
  const hs = epics.map(e => e.health)
  if (hs.some(h => h === 'Blocked')) return 'Blocked'
  if (hs.every(h => h === 'Good')) return 'Done'
  if (hs.every(h => h === 'Good' || h === 'N/A')) return 'Good'
  return 'At Risk'
}

function piProgress(startIso, endIso) {
  const start = new Date(startIso), end = new Date(endIso), today = new Date()
  if (today <= start) return 0
  if (today >= end)   return 100
  return Math.round(((today - start) / (end - start)) * 100)
}

export default function InitiativeDetailPage() {
  const { key } = useParams()
  const navigate = useNavigate()
  const { epics, loading, error, reload } = useInitiativeDetail(key)
  const { piByInitiative, piIdByInitiative } = usePIAssignments()
  const { pis } = usePIs()

  const health = initiativeHealth(epics)
  const totalSubtasksDone = epics.reduce((s, e) => s + (e.subtasks?.done || 0), 0)
  const totalSubtasks     = epics.reduce((s, e) => s + (e.subtasks?.total || 0), 0)
  const totalTestPass     = epics.reduce((s, e) => s + (e.tests?.pass || 0), 0)
  const totalTests        = epics.reduce((s, e) => s + (e.tests?.total || 0), 0)
  const passRate = totalTests > 0 ? Math.round((totalTestPass / totalTests) * 100) : 0
  const devPct   = totalSubtasks > 0 ? Math.round((totalSubtasksDone / totalSubtasks) * 100) : 0

  // PI context
  const piId   = piIdByInitiative[key]
  const piName = piByInitiative[key]
  const pi     = piId ? pis.find(p => p.id === piId) : null
  const progress   = pi ? piProgress(pi.start_date, pi.end_date) : null
  const isPastEnd  = pi && new Date() > new Date(pi.end_date)

  const summaryStats = [
    { label: 'Epics',     value: epics.length },
    { label: 'Avg Dev',   value: `${devPct}%` },
    { label: 'Test Cases',value: totalTests },
    { label: 'Pass Rate', value: `${passRate}%`, color: passRate >= 90 ? 'good' : passRate >= 50 ? 'risk' : 'block' },
    { label: 'Blocked',   value: epics.filter(e => e.health === 'Blocked').length, color: 'block' },
    { label: 'At Risk',   value: epics.filter(e => e.health === 'At Risk').length, color: 'risk' },
    { label: 'Good',      value: epics.filter(e => e.health === 'Good').length, color: 'good' },
  ]

  return (
    <div className="page">
      <div className="detail-header">
        {/* Breadcrumb — shows PI context if available */}
        <div className="breadcrumb">
          {pi ? (
            <>
              <Link to="/pi">{pi.name}</Link>
              <span style={{ margin: '0 6px', color: '#97A0AF' }}>/</span>
              <Link to="/">Initiatives</Link>
            </>
          ) : (
            <Link to="/">← Initiatives</Link>
          )}
        </div>

        <div className="detail-header__top">
          <div style={{ flex: 1 }}>
            <h1 className="detail-header__title">{key}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <span className="detail-header__key">{key}</span>
              {piName && (
                <span style={{ fontSize: 11, background: '#EAE6FF', color: '#403294', padding: '2px 9px', borderRadius: 10, fontWeight: 700 }}>
                  {piName}
                </span>
              )}
            </div>
          </div>
          <HealthChip health={health} />
          <a href={`https://${JIRA_HOST}/browse/${key}`} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
            ↗ Open in Jira
          </a>
          <button className="btn btn--ghost btn--sm" onClick={reload}>↺ Refresh</button>
        </div>

        {/* PI context strip — only shown when initiative is in a PI */}
        {pi && (
          <div className="detail-pi-strip">
            <div className="detail-pi-strip__info">
              <span className="detail-pi-strip__label">PI Window</span>
              <span className="detail-pi-strip__dates">
                {new Date(pi.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' – '}
                {new Date(pi.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {isPastEnd
                ? <span style={{ fontSize: 11, color: '#FF991F', fontWeight: 700 }}>PI complete</span>
                : <span style={{ fontSize: 11, color: '#0052CC', fontWeight: 700 }}>{progress}% elapsed</span>
              }
            </div>
            <div className="detail-pi-strip__bar-wrap">
              <div className="progress-bar" style={{ height: 8, flex: 1 }}>
                <div
                  className="progress-bar__fill"
                  style={{ width: `${progress}%`, background: isPastEnd ? '#FF991F' : '#0052CC' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      <EpicTable epics={epics} jiraHost={JIRA_HOST} loading={loading} />

      <TeamWorkloadPanel epics={epics} />

      <SummaryBar label={key} stats={summaryStats} />
    </div>
  )
}
