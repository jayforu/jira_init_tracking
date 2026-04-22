import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import useExecutiveDashboard from '../hooks/useExecutiveDashboard'
import useExecutivePIDashboard from '../hooks/useExecutivePIDashboard'
import usePIs from '../hooks/usePIs'
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
  return `${Math.round(mins / 60)}h ago`
}

function piProgress(startIso, endIso) {
  const start = new Date(startIso)
  const end   = new Date(endIso)
  const today = new Date()
  if (today <= start) return 0
  if (today >= end)   return 100
  return Math.round(((today - start) / (end - start)) * 100)
}

function isActivePi(pi) {
  const now = new Date()
  return new Date(pi.start_date) <= now && now <= new Date(pi.end_date)
}

// ── Project-scoped wrapper ──────────────────────────────────────────────────

function ProjectView({ activeProject, includeDone, projects, syncState, triggerSync }) {
  const navigate = useNavigate()
  const isAll = activeProject === 'ALL'
  const { initiatives, loading, error } = useExecutiveDashboard(activeProject, includeDone)
  const projectName = isAll ? 'All Projects' : (projects.find(p => p.key === activeProject)?.name || activeProject)

  const kpi = useMemo(() => ({
    total:   initiatives.length,
    blocked: initiatives.filter(i => i.health === 'Blocked').length,
    atRisk:  initiatives.filter(i => i.health === 'At Risk').length,
    onTrack: initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length,
  }), [initiatives])

  const attentionItems = useMemo(() =>
    initiatives.filter(i => i.health === 'Blocked' || i.health === 'At Risk').slice(0, 10),
  [initiatives])

  return (
    <div className="exec-page">
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
          {!isAll && (
            <button className="btn btn--ghost btn--sm" onClick={triggerSync} disabled={syncState?.status === 'syncing'}>
              {syncState?.status === 'syncing' ? '⟳ Syncing…' : '⟳ Sync Jira'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="exec-kpi-strip">
        <KpiCard label="Total Initiatives" value={kpi.total} />
        <KpiCard label="On Track"          value={kpi.onTrack}  color="#36B37E" />
        <KpiCard label="At Risk"           value={kpi.atRisk}   color="#FF991F" />
        <KpiCard label="Blocked"           value={kpi.blocked}  color="#FF5630" />
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Building executive summary...</div>
      ) : (
        <div className="exec-layout">
          <div className="exec-cards">
            <div className="exec-section-title">Initiative Health</div>
            {initiatives.length === 0 && (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <h3>No pinned initiatives</h3>
                <p>Pin initiatives on the <a href="/">Initiatives</a> page to see them here.</p>
              </div>
            )}
            {initiatives.map(i => (
              <InitiativeCard key={i.key} initiative={i} showProject={isAll} onClick={() => navigate(`/initiative/${i.key}`)} />
            ))}
          </div>
          <AttentionPanel items={attentionItems} showProject={isAll} navigate={navigate} />
        </div>
      )}
    </div>
  )
}

// ── PI-scoped view ──────────────────────────────────────────────────────────

function PIView({ piId, includeDone }) {
  const navigate = useNavigate()
  const { pi, initiatives, loading, error } = useExecutivePIDashboard(piId, includeDone)

  const kpi = useMemo(() => ({
    total:   initiatives.length,
    blocked: initiatives.filter(i => i.health === 'Blocked').length,
    atRisk:  initiatives.filter(i => i.health === 'At Risk').length,
    onTrack: initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length,
    spilled: initiatives.filter(i => i.spilled_over).length,
  }), [initiatives])

  const attentionItems = useMemo(() =>
    initiatives.filter(i => i.health === 'Blocked' || i.health === 'At Risk' || i.spilled_over).slice(0, 10),
  [initiatives])

  const progress = pi ? piProgress(pi.start_date, pi.end_date) : 0
  const isPastEnd = pi && new Date() > new Date(pi.end_date)

  return (
    <div className="exec-page">
      <div className="exec-page-header">
        <div style={{ flex: 1 }}>
          <h1 className="exec-page-header__title">
            {pi?.name || '…'} — Executive View
          </h1>
          <span className="exec-page-header__sub">
            {pi && `${new Date(pi.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(pi.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            {pi && !isPastEnd && progress > 0 && ` · ${progress}% elapsed`}
            {isPastEnd && <span style={{ color: '#FF991F' }}> · PI complete</span>}
          </span>
        </div>
        {/* PI elapsed progress bar */}
        {pi && (
          <div style={{ width: 180 }}>
            <div style={{ fontSize: 10, color: '#6B778C', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>PI elapsed</div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div
                className="progress-bar__fill"
                style={{ width: `${progress}%`, background: isPastEnd ? '#FF991F' : '#0052CC' }}
              />
            </div>
          </div>
        )}
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="exec-kpi-strip" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <KpiCard label="Initiatives"  value={kpi.total} />
        <KpiCard label="On Track"     value={kpi.onTrack}  color="#36B37E" />
        <KpiCard label="At Risk"      value={kpi.atRisk}   color="#FF991F" />
        <KpiCard label="Blocked"      value={kpi.blocked}  color="#FF5630" />
        <KpiCard label="Spilled Over" value={kpi.spilled}  color={kpi.spilled > 0 ? '#FF991F' : '#97A0AF'} />
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Building PI summary...</div>
      ) : (
        <div className="exec-layout">
          <div className="exec-cards">
            <div className="exec-section-title">PI Initiative Health</div>
            {initiatives.length === 0 && (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <h3>No initiatives in this PI</h3>
                <p>Assign initiatives from the <a href="/pi">PI Board</a> or the Initiatives page.</p>
              </div>
            )}
            {initiatives.map(i => (
              <InitiativeCard key={i.key} initiative={i} showProject={true} showSpill={true} onClick={() => navigate(`/initiative/${i.key}`)} />
            ))}
          </div>
          <AttentionPanel items={attentionItems} showProject={true} showSpill={true} navigate={navigate} />
        </div>
      )}
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function ExecutiveDashboardPage() {
  const { projects, loading: projLoading } = useProjects()
  const { pis, loading: pisLoading } = usePIs()
  const [activeTab, setActiveTab] = useState(null) // null = auto-select
  const [includeDone, setIncludeDone] = useState(false)

  // Auto-select: active PI first, then ALL
  const resolvedTab = activeTab || (pis.find(isActivePi)?.id) || 'ALL'
  const isPiTab = resolvedTab !== 'ALL' && !projects.some(p => p.key === resolvedTab)

  const { syncState, triggerSync } = useSyncStatus(isPiTab ? null : (resolvedTab === 'ALL' ? null : resolvedTab))

  if (projLoading || pisLoading) return <div className="loading"><div className="spinner" /> Loading...</div>

  if (!projects.length) return (
    <div className="empty-state">
      <h3>No projects configured</h3>
      <p>Go to Settings to add a Jira project.</p>
    </div>
  )

  return (
    <div>
      {/* Tab row: PIs first, then project tabs */}
      <div className="tabs">
        {pis.length > 0 && (
          <>
            {pis.map(pi => {
              const active = isActivePi(pi)
              return (
                <button
                  key={pi.id}
                  className={`tab ${resolvedTab === pi.id ? 'tab--active' : ''}`}
                  onClick={() => setActiveTab(pi.id)}
                >
                  {pi.name}
                  {active && <span style={{ marginLeft: 4, fontSize: 9, background: '#36B37E', color: 'white', padding: '1px 5px', borderRadius: 8, fontWeight: 700, verticalAlign: 'middle' }}>ACTIVE</span>}
                </button>
              )
            })}
            <div style={{ width: 1, background: '#DFE1E6', margin: '8px 4px', alignSelf: 'stretch' }} />
          </>
        )}

        <button
          className={`tab ${resolvedTab === 'ALL' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Projects
          <span className="tab__badge">{resolvedTab === 'ALL' ? '—' : '—'}</span>
        </button>
        {projects.map(p => (
          <button
            key={p.key}
            className={`tab ${resolvedTab === p.key ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(p.key)}
          >
            {p.name}
          </button>
        ))}

        {/* Include Done toggle lives in the tab bar */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: 16 }}>
          <button
            className={`toggle-btn ${includeDone ? 'toggle-btn--active' : ''}`}
            style={{ fontSize: 11 }}
            onClick={() => setIncludeDone(v => !v)}
          >
            Show Done
          </button>
        </div>
      </div>

      <div className="page exec-page">
        {isPiTab ? (
          <PIView piId={resolvedTab} includeDone={includeDone} />
        ) : (
          <ProjectView
            activeProject={resolvedTab}
            includeDone={includeDone}
            projects={projects}
            syncState={syncState}
            triggerSync={triggerSync}
          />
        )}
      </div>
    </div>
  )
}

// ── Shared sub-components ───────────────────────────────────────────────────

function KpiCard({ label, value, color }) {
  return (
    <div className="exec-kpi-card">
      <span className="exec-kpi-card__value" style={color ? { color } : {}}>{value}</span>
      <span className="exec-kpi-card__label">{label}</span>
    </div>
  )
}

function AttentionPanel({ items, showProject, showSpill, navigate }) {
  return (
    <div className="exec-attention">
      <div className="exec-section-title">Needs Attention</div>
      {items.length === 0 ? (
        <div className="exec-attention__all-good">
          <div className="exec-attention__all-good-icon">✓</div>
          <div className="exec-attention__all-good-text">All initiatives on track</div>
        </div>
      ) : (
        items.map(i => (
          <AttentionItem key={i.key} initiative={i} showProject={showProject} showSpill={showSpill} onClick={() => navigate(`/initiative/${i.key}`)} />
        ))
      )}
    </div>
  )
}

function InitiativeCard({ initiative, showProject, showSpill, onClick }) {
  const { summary, key, assignee, health, devPercent, testPassRate, testTotal, epicCount, blockedEpics, atRiskEpics, project_name, spilled_over } = initiative
  const hc = HEALTH_COLOR[health] || HEALTH_COLOR['N/A']

  return (
    <div className="exec-card" onClick={onClick} style={spilled_over ? { opacity: 0.75, borderStyle: 'dashed' } : {}}>
      <div className="exec-card__header">
        <div className="exec-card__title-block">
          <span className="exec-card__dot" style={{ background: hc.dot }} />
          <div>
            <div className="exec-card__name">
              {summary}
              {showProject && <span className="exec-card__project-tag">{project_name}</span>}
              {showSpill && spilled_over && (
                <span style={{ marginLeft: 6, fontSize: 10, background: '#FFFAE6', color: '#974F0C', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>→ Next PI</span>
              )}
            </div>
            <div className="exec-card__meta">{key} · {assignee || 'Unassigned'} · {epicCount} epic{epicCount !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <span className="exec-card__badge" style={{ background: hc.bg, color: hc.text }}>{health}</span>
      </div>

      <div className="exec-card__metrics">
        <div className="exec-card__metric">
          <div className="exec-card__metric-label">Dev Progress</div>
          <div className="exec-card__progress-row">
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-bar__fill" style={{ width: `${devPercent}%`, background: devPercent >= 80 ? '#36B37E' : devPercent >= 40 ? '#FF991F' : '#FF5630' }} />
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
                <div className="progress-bar__fill" style={{ width: `${testPassRate}%`, background: testPassRate >= 90 ? '#36B37E' : testPassRate >= 60 ? '#FF991F' : '#FF5630' }} />
              </div>
              <span className="exec-card__metric-pct">{testPassRate}%</span>
            </div>
          )}
        </div>
      </div>

      {(blockedEpics > 0 || atRiskEpics > 0) && (
        <div className="exec-card__epic-flags">
          {blockedEpics > 0 && <span className="exec-card__flag exec-card__flag--blocked">{blockedEpics} blocked</span>}
          {atRiskEpics  > 0 && <span className="exec-card__flag exec-card__flag--atrisk">{atRiskEpics} at risk</span>}
        </div>
      )}
    </div>
  )
}

function AttentionItem({ initiative, showProject, showSpill, onClick }) {
  const { summary, key, assignee, health, blockedEpics, atRiskEpics, devPercent, testPassRate, testTotal, project_name, spilled_over } = initiative
  const isBlocked  = health === 'Blocked'
  const isSpillOnly = spilled_over && health !== 'Blocked' && health !== 'At Risk'

  const reasons = []
  if (blockedEpics > 0) reasons.push(`${blockedEpics} epic${blockedEpics > 1 ? 's' : ''} blocked`)
  if (atRiskEpics  > 0 && !isBlocked) reasons.push(`${atRiskEpics} at risk`)
  if (testTotal > 0 && testPassRate < 60) reasons.push(`${testPassRate}% test pass rate`)
  if (devPercent < 30 && devPercent > 0) reasons.push(`${devPercent}% dev complete`)
  if (showSpill && spilled_over) reasons.push('spilling to next PI')

  const variant = isBlocked ? 'blocked' : isSpillOnly ? 'atrisk' : 'atrisk'
  const tag     = isBlocked ? 'BLOCKED'  : isSpillOnly ? 'SPILL'   : 'AT RISK'

  return (
    <div className={`exec-attention__item exec-attention__item--${variant}`} onClick={onClick}>
      <div className="exec-attention__item-header">
        <span className={`exec-attention__tag exec-attention__tag--${isBlocked ? 'blocked' : 'atrisk'}`}>{tag}</span>
        <span className="exec-attention__item-name">{summary}</span>
      </div>
      <div className="exec-attention__item-owner">
        {key} · {assignee || 'Unassigned'}
        {showProject && <span className="exec-attention__project-tag">{project_name}</span>}
      </div>
      {reasons.length > 0 && (
        <div className="exec-attention__reasons">
          {reasons.map((r, idx) => <span key={idx} className="exec-attention__reason">· {r}</span>)}
        </div>
      )}
    </div>
  )
}
