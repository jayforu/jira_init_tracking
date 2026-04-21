import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import useExecutiveDashboard from '../hooks/useExecutiveDashboard'
import useSyncStatus from '../hooks/useSyncStatus'

const HEALTH_COLOR = {
  Good:     { bg: '#E3FCEF', text: '#006644', dot: '#36B37E' },
  Done:     { bg: '#E3FCEF', text: '#006644', dot: '#36B37E' },
  'At Risk':{ bg: '#FFFAE6', text: '#974F0C', dot: '#FF991F' },
  Blocked:  { bg: '#FFEBE6', text: '#BF2600', dot: '#FF5630' },
  'N/A':    { bg: '#F4F5F7', text: '#6B778C', dot: '#DFE1E6' },
}

function timeSince(date) {
  if (!date) return null
  const mins = Math.round((Date.now() - date) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  return `${hrs}h ago`
}

export default function ExecutiveDashboardPage() {
  const navigate = useNavigate()
  const { projects, loading: projLoading } = useProjects()
  const [activeProject, setActiveProject] = useState('ALL')
  const [includeDone, setIncludeDone] = useState(false)

  const currentProject = activeProject
  const isAll = currentProject === 'ALL'
  const { initiatives, loading, error, reload } = useExecutiveDashboard(currentProject, includeDone)
  const { syncState, triggerSync } = useSyncStatus(isAll ? null : currentProject)

  const projectName = isAll ? 'All Projects' : (projects.find(p => p.key === currentProject)?.name || currentProject)

  const kpi = useMemo(() => {
    const total    = initiatives.length
    const blocked  = initiatives.filter(i => i.health === 'Blocked').length
    const atRisk   = initiatives.filter(i => i.health === 'At Risk').length
    const onTrack  = initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length
    return { total, blocked, atRisk, onTrack }
  }, [initiatives])

  const attentionItems = useMemo(() => {
    return initiatives
      .filter(i => i.health === 'Blocked' || i.health === 'At Risk')
      .slice(0, 10)
  }, [initiatives])

  if (projLoading) return <div className="loading"><div className="spinner" /> Loading projects...</div>

  if (!projects.length) return (
    <div className="empty-state">
      <h3>No projects configured</h3>
      <p>Go to Settings to add a Jira project.</p>
    </div>
  )

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${isAll ? 'tab--active' : ''}`}
          onClick={() => setActiveProject('ALL')}
        >
          All Projects
          <span className="tab__badge">{isAll ? initiatives.length : '—'}</span>
        </button>
        {projects.map(p => (
          <button
            key={p.key}
            className={`tab ${currentProject === p.key ? 'tab--active' : ''}`}
            onClick={() => setActiveProject(p.key)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="page exec-page">
        <div className="exec-page-header">
          <div>
            <h1 className="exec-page-header__title">{projectName} — Executive View</h1>
            <span className="exec-page-header__sub">
              Program health summary
              {syncState?.last_synced_at && ` · Synced ${timeSince(new Date(syncState.last_synced_at))}`}
              {syncState?.status === 'error' && <span style={{ color: '#FF5630' }}> · Sync error</span>}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className={`toggle-btn ${includeDone ? 'toggle-btn--active' : ''}`}
              onClick={() => setIncludeDone(v => !v)}
            >
              Show Done
            </button>
            {!isAll && (
              <button
                className="btn btn--ghost btn--sm"
                onClick={triggerSync}
                disabled={syncState?.status === 'syncing'}
              >
                {syncState?.status === 'syncing' ? '⟳ Syncing…' : '⟳ Sync Jira'}
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {/* KPI Strip */}
        <div className="exec-kpi-strip">
          <KpiCard label="Total Initiatives" value={kpi.total} />
          <KpiCard label="On Track" value={kpi.onTrack} color="#36B37E" />
          <KpiCard label="At Risk" value={kpi.atRisk} color="#FF991F" />
          <KpiCard label="Blocked" value={kpi.blocked} color="#FF5630" />
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Building executive summary...</div>
        ) : (
          <div className="exec-layout">
            {/* Initiative Cards */}
            <div className="exec-cards">
              <div className="exec-section-title">Initiative Health</div>
              {initiatives.length === 0 && (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <h3>No pinned initiatives</h3>
                  <p>Pin initiatives on the <a href="/">Initiatives</a> page to see them here.</p>
                </div>
              )}
              {initiatives.map(i => (
                <InitiativeCard
                  key={i.key}
                  initiative={i}
                  showProject={isAll}
                  onClick={() => navigate(`/initiative/${i.key}`)}
                />
              ))}
            </div>

            {/* Needs Attention Panel */}
            <div className="exec-attention">
              <div className="exec-section-title">Needs Attention</div>
              {attentionItems.length === 0 ? (
                <div className="exec-attention__all-good">
                  <div className="exec-attention__all-good-icon">✓</div>
                  <div className="exec-attention__all-good-text">All initiatives on track</div>
                </div>
              ) : (
                attentionItems.map(i => (
                  <AttentionItem
                    key={i.key}
                    initiative={i}
                    showProject={isAll}
                    onClick={() => navigate(`/initiative/${i.key}`)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, value, color }) {
  return (
    <div className="exec-kpi-card">
      <span className="exec-kpi-card__value" style={color ? { color } : {}}>
        {value}
      </span>
      <span className="exec-kpi-card__label">{label}</span>
    </div>
  )
}

function InitiativeCard({ initiative, showProject, onClick }) {
  const { summary, key, assignee, health, devPercent, testPassRate, testTotal, epicCount, blockedEpics, atRiskEpics, project_name } = initiative
  const hc = HEALTH_COLOR[health] || HEALTH_COLOR['N/A']

  return (
    <div className="exec-card" onClick={onClick}>
      <div className="exec-card__header">
        <div className="exec-card__title-block">
          <span className="exec-card__dot" style={{ background: hc.dot }} />
          <div>
            <div className="exec-card__name">
              {summary}
              {showProject && <span className="exec-card__project-tag">{project_name}</span>}
            </div>
            <div className="exec-card__meta">{key} · {assignee || 'Unassigned'} · {epicCount} epic{epicCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <span className="exec-card__badge" style={{ background: hc.bg, color: hc.text }}>
          {health}
        </span>
      </div>

      <div className="exec-card__metrics">
        <div className="exec-card__metric">
          <div className="exec-card__metric-label">Dev Progress</div>
          <div className="exec-card__progress-row">
            <div className="progress-bar" style={{ flex: 1 }}>
              <div
                className="progress-bar__fill"
                style={{ width: `${devPercent}%`, background: devPercent >= 80 ? '#36B37E' : devPercent >= 40 ? '#FF991F' : '#FF5630' }}
              />
            </div>
            <span className="exec-card__metric-pct">{devPercent}%</span>
          </div>
        </div>

        <div className="exec-card__metric">
          <div className="exec-card__metric-label">Test Pass Rate</div>
          {testTotal === 0 ? (
            <span className="exec-card__no-tests">No tests</span>
          ) : (
            <div className="exec-card__progress-row">
              <div className="progress-bar" style={{ flex: 1 }}>
                <div
                  className="progress-bar__fill"
                  style={{ width: `${testPassRate}%`, background: testPassRate >= 90 ? '#36B37E' : testPassRate >= 60 ? '#FF991F' : '#FF5630' }}
                />
              </div>
              <span className="exec-card__metric-pct">{testPassRate}%</span>
            </div>
          )}
        </div>
      </div>

      {(blockedEpics > 0 || atRiskEpics > 0) && (
        <div className="exec-card__epic-flags">
          {blockedEpics > 0 && (
            <span className="exec-card__flag exec-card__flag--blocked">{blockedEpics} blocked</span>
          )}
          {atRiskEpics > 0 && (
            <span className="exec-card__flag exec-card__flag--atrisk">{atRiskEpics} at risk</span>
          )}
        </div>
      )}
    </div>
  )
}

function AttentionItem({ initiative, showProject, onClick }) {
  const { summary, key, assignee, health, blockedEpics, atRiskEpics, devPercent, testPassRate, testTotal, project_name } = initiative
  const isBlocked = health === 'Blocked'

  const reasons = []
  if (blockedEpics > 0) reasons.push(`${blockedEpics} epic${blockedEpics > 1 ? 's' : ''} blocked`)
  if (atRiskEpics > 0 && !isBlocked) reasons.push(`${atRiskEpics} at risk`)
  if (testTotal > 0 && testPassRate < 60) reasons.push(`${testPassRate}% test pass rate`)
  if (devPercent < 30 && devPercent > 0) reasons.push(`${devPercent}% dev complete`)

  return (
    <div className={`exec-attention__item exec-attention__item--${isBlocked ? 'blocked' : 'atrisk'}`} onClick={onClick}>
      <div className="exec-attention__item-header">
        <span className={`exec-attention__tag exec-attention__tag--${isBlocked ? 'blocked' : 'atrisk'}`}>
          {isBlocked ? 'BLOCKED' : 'AT RISK'}
        </span>
        <span className="exec-attention__item-name">{summary}</span>
      </div>
      <div className="exec-attention__item-owner">
        {key} · {assignee || 'Unassigned'}
        {showProject && <span className="exec-attention__project-tag">{project_name}</span>}
      </div>
      {reasons.length > 0 && (
        <div className="exec-attention__reasons">
          {reasons.map((r, idx) => (
            <span key={idx} className="exec-attention__reason">· {r}</span>
          ))}
        </div>
      )}
    </div>
  )
}
