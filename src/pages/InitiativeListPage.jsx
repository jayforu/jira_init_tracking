import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import useProjects from '../hooks/useProjects'
import usePins from '../hooks/usePins'
import useInitiatives from '../hooks/useInitiatives'
import useSyncStatus from '../hooks/useSyncStatus'
import usePIAssignments from '../hooks/usePIAssignments'
import usePIs from '../hooks/usePIs'
import HealthChip from '../components/HealthChip'
import SummaryBar from '../components/SummaryBar'

function timeSince(date) {
  if (!date) return null
  const mins = Math.round((Date.now() - date) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

function piProgress(startIso, endIso) {
  const start = new Date(startIso), end = new Date(endIso), today = new Date()
  if (today <= start) return 0
  if (today >= end)   return 100
  return Math.round(((today - start) / (end - start)) * 100)
}

// ── PI-scoped cross-project view ────────────────────────────────────────────

function PIFilterView({ pi, projects, pis, piByInitiative, piIdByInitiative, assignToPI }) {
  const navigate = useNavigate()
  const [boardInitiatives, setBoardInitiatives] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    axios.get(`/api/pis/${pi.id}/board`)
      .then(r => { if (!cancelled) setBoardInitiatives(r.data.initiatives) })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [pi.id])

  const filtered = useMemo(() => {
    if (!search.trim()) return boardInitiatives
    const q = search.toLowerCase()
    return boardInitiatives.filter(i =>
      i.summary?.toLowerCase().includes(q) || i.initiative_key?.toLowerCase().includes(q)
    )
  }, [boardInitiatives, search])

  const active  = filtered.filter(i => !i.spilled_over)
  const spilled = filtered.filter(i => i.spilled_over)

  const progress = piProgress(pi.start_date, pi.end_date)
  const projectName = (key) => projects.find(p => p.key === key)?.name || key

  const summaryStats = [
    { label: 'Initiatives',  value: boardInitiatives.length },
    { label: 'Spilled',      value: boardInitiatives.filter(i => i.spilled_over).length, color: 'risk' },
    { label: 'Blocked',      value: boardInitiatives.filter(i => i.health === 'Blocked').length, color: 'block' },
    { label: 'At Risk',      value: boardInitiatives.filter(i => i.health === 'At Risk').length, color: 'risk' },
    { label: 'On Track',     value: boardInitiatives.filter(i => i.health === 'Good' || i.health === 'Done').length, color: 'good' },
  ]

  return (
    <div className="page">
      {/* PI context header */}
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <h1 className="page-header__title">{pi.name} — All Initiatives</h1>
          <span className="page-header__sub">
            {new Date(pi.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {new Date(pi.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {progress > 0 && progress < 100 && ` · ${progress}% elapsed`}
            {progress >= 100 && <span style={{ color: '#FF991F' }}> · PI complete</span>}
          </span>
        </div>
        <div style={{ width: 160 }}>
          <div style={{ fontSize: 10, color: '#6B778C', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>PI Progress</div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-bar__fill" style={{ width: `${progress}%`, background: progress >= 100 ? '#FF991F' : '#0052CC' }} />
          </div>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="toolbar__search"
          placeholder="🔍  Search initiatives..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading PI initiatives...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Initiative</th>
              <th>Project</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Health</th>
              <th style={{ width: 160 }}>PI</th>
            </tr>
          </thead>
          <tbody>
            {active.length === 0 && spilled.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6B778C' }}>
                  No initiatives assigned to this PI yet.
                </td>
              </tr>
            )}

            {active.map(i => (
              <PICrossRow
                key={i.initiative_key} initiative={i}
                projectName={projectName(i.project_key)}
                pis={pis}
                currentPiId={piIdByInitiative[i.initiative_key]}
                onAssignPI={(piId) => assignToPI(i.initiative_key, i.project_key, piId)}
                onClick={() => navigate(`/initiative/${i.initiative_key}`)}
              />
            ))}

            {spilled.length > 0 && (
              <>
                <tr>
                  <td colSpan={6}>
                    <div style={{ padding: '6px 12px', fontSize: 11, color: '#FF991F', fontWeight: 700, background: '#FFFAE6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Spilled Over — Moving to Next PI ({spilled.length})
                    </div>
                  </td>
                </tr>
                {spilled.map(i => (
                  <PICrossRow
                    key={i.initiative_key} initiative={i} dimmed
                    projectName={projectName(i.project_key)}
                    pis={pis}
                    currentPiId={piIdByInitiative[i.initiative_key]}
                    onAssignPI={(piId) => assignToPI(i.initiative_key, i.project_key, piId)}
                    onClick={() => navigate(`/initiative/${i.initiative_key}`)}
                    spilled
                  />
                ))}
              </>
            )}
          </tbody>
        </table>
      )}

      <SummaryBar label={pi.name} stats={summaryStats} />
    </div>
  )
}

function PICrossRow({ initiative, projectName, pis, currentPiId, onAssignPI, onClick, dimmed, spilled }) {
  const { initiative_key, summary, status, assignee, health } = initiative
  const [saving, setSaving] = useState(false)

  const STATUS_COLORS = {
    'In Development': { bg: '#DEEBFF', color: '#0052CC' },
    'Done':           { bg: '#E3FCEF', color: '#006644' },
    'Blocked':        { bg: '#FFEBE6', color: '#BF2600' },
    'At Risk':        { bg: '#FFFAE6', color: '#974F0C' },
    'Backlog':        { bg: '#EBECF0', color: '#42526E' },
    'In Review':      { bg: '#EAE6FF', color: '#403294' },
  }
  const badge = STATUS_COLORS[status] || { bg: '#EBECF0', color: '#42526E' }

  const handlePiChange = async (e) => {
    e.stopPropagation()
    setSaving(true)
    try { await onAssignPI(e.target.value || null) } finally { setSaving(false) }
  }

  return (
    <tr style={{ cursor: 'pointer', opacity: dimmed ? 0.75 : 1 }} onClick={onClick}>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>
          {summary}
          {spilled && <span style={{ marginLeft: 6, fontSize: 10, color: '#FF991F', fontWeight: 700 }}>→ Next PI</span>}
        </div>
        <div style={{ fontSize: 11, color: '#6B778C', marginTop: 1 }}>{initiative_key}</div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ fontSize: 11, background: '#DEEBFF', color: '#0052CC', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
          {projectName}
        </span>
      </td>
      <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>
        {assignee || <span style={{ color: '#97A0AF' }}>Unassigned</span>}
      </td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: badge.bg, color: badge.color }}>
          {status}
        </span>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <HealthChip health={health} />
      </td>
      <td style={{ padding: '8px 12px' }} onClick={e => e.stopPropagation()}>
        <select className="pi-select" value={currentPiId || ''} onChange={handlePiChange} disabled={saving}>
          <option value="">— No PI —</option>
          {pis.map(pi => <option key={pi.id} value={pi.id}>{pi.name}</option>)}
        </select>
      </td>
    </tr>
  )
}

// ── Project-scoped view (default) ───────────────────────────────────────────

export default function InitiativeListPage() {
  const navigate = useNavigate()
  const { projects, loading: projLoading } = useProjects()
  const { pis } = usePIs()
  const { piByInitiative, piIdByInitiative, assignToPI } = usePIAssignments()

  const [activeProject, setActiveProject] = useState(null)
  const [filterPiId, setFilterPiId] = useState('')   // '' = no PI filter
  const [search, setSearch] = useState('')
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const currentProject = activeProject || projects[0]?.key
  const { initiatives, loading, error, reload } = useInitiatives(currentProject, showDone)
  const { pins, pin, unpin, isPinned } = usePins(currentProject)
  const { syncState, triggerSync } = useSyncStatus(filterPiId ? null : currentProject)

  useEffect(() => {
    if (syncState?.status === 'idle' && syncState?.last_synced_at) reload()
  }, [syncState?.status, syncState?.last_synced_at])

  const filtered = useMemo(() => {
    return initiatives.filter(i => {
      if (!showDone && i.statusCategory === 'Done') return false
      if (search) {
        const q = search.toLowerCase()
        if (!i.summary.toLowerCase().includes(q) && !i.key.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [initiatives, search, showDone])

  const pinned   = filtered.filter(i => isPinned(i.key))
  const unpinned = filtered.filter(i => !isPinned(i.key))

  const togglePin = async (e, key) => {
    e.stopPropagation()
    isPinned(key) ? await unpin(key) : await pin(key)
  }

  const summaryStats = [
    { label: 'Total Initiatives', value: initiatives.length },
    { label: 'Pinned',  value: pins.length },
    { label: 'Blocked', value: initiatives.filter(i => i.health === 'Blocked').length, color: 'block' },
    { label: 'At Risk', value: initiatives.filter(i => i.health === 'At Risk').length, color: 'risk' },
    { label: 'Good',    value: initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length, color: 'good' },
  ]

  if (projLoading) return <div className="loading"><div className="spinner" /> Loading projects...</div>

  if (!projects.length) return (
    <div className="empty-state">
      <h3>No projects configured</h3>
      <p>Go to <Link to="/settings">Settings</Link> to add a Jira project.</p>
    </div>
  )

  // When a PI filter is active, hand off to the cross-project view
  const activePi = filterPiId ? pis.find(p => p.id === filterPiId) : null
  if (activePi) {
    return (
      <>
        {/* Show project tabs grayed out + PI selector still accessible */}
        <div className="tabs">
          {projects.map(p => (
            <button key={p.key} className="tab" style={{ opacity: 0.4 }} onClick={() => setFilterPiId('')}>
              {p.name}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
            <span style={{ fontSize: 11, color: '#6B778C' }}>Filtering by PI:</span>
            <select className="pi-select" value={filterPiId} onChange={e => setFilterPiId(e.target.value)} style={{ fontWeight: 700, color: '#403294' }}>
              {pis.map(pi => <option key={pi.id} value={pi.id}>{pi.name}</option>)}
            </select>
            <button className="btn btn--ghost btn--sm" onClick={() => setFilterPiId('')} style={{ fontSize: 11 }}>✕ Clear</button>
          </div>
        </div>
        <PIFilterView
          pi={activePi}
          projects={projects}
          pis={pis}
          piByInitiative={piByInitiative}
          piIdByInitiative={piIdByInitiative}
          assignToPI={assignToPI}
        />
      </>
    )
  }

  return (
    <div>
      <div className="tabs">
        {projects.map(p => (
          <button
            key={p.key}
            className={`tab ${currentProject === p.key ? 'tab--active' : ''}`}
            onClick={() => { setActiveProject(p.key); setShowAll(false) }}
          >
            {p.name}
            <span className="tab__badge">{currentProject === p.key ? initiatives.length : '—'}</span>
          </button>
        ))}
      </div>

      <div className="page">
        <div className="page-header">
          <div style={{ flex: 1 }}>
            <h1 className="page-header__title">
              {projects.find(p => p.key === currentProject)?.name} — Tracked Initiatives
            </h1>
            <span className="page-header__sub">
              {pins.length} tracked · {initiatives.length} total
              {syncState?.last_synced_at && ` · Synced ${timeSince(new Date(syncState.last_synced_at))}`}
              {syncState?.status === 'error' && <span style={{ color: '#FF5630' }}> · Sync error</span>}
            </span>
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={triggerSync}
            disabled={syncState?.status === 'syncing'}
            title={syncState?.error || undefined}
          >
            {syncState?.status === 'syncing' ? '⟳ Syncing…' : '⟳ Sync Jira'}
          </button>
        </div>

        <div className="toolbar">
          <input
            className="toolbar__search"
            placeholder="🔍  Search initiatives..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className={`toggle-btn ${pinnedOnly ? 'toggle-btn--active' : ''}`} onClick={() => setPinnedOnly(v => !v)}>
            📌 Pinned only
          </button>
          <button className={`toggle-btn ${showDone ? 'toggle-btn--active' : ''}`} onClick={() => setShowDone(v => !v)}>
            Show Done
          </button>
          {/* PI Filter */}
          {pis.length > 0 && (
            <select
              className="pi-select"
              value={filterPiId}
              onChange={e => setFilterPiId(e.target.value)}
              style={{ marginLeft: 'auto' }}
              title="Filter by Program Increment"
            >
              <option value="">All PIs</option>
              {pis.map(pi => <option key={pi.id} value={pi.id}>{pi.name}</option>)}
            </select>
          )}
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <div className="loading"><div className="spinner" /> Fetching initiatives from Jira...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 32 }}></th>
                <th>Initiative</th>
                <th>Assignee</th>
                <th>Status</th>
                <th style={{ width: 160 }}>PI</th>
              </tr>
            </thead>
            <tbody>
              {pinned.length === 0 && unpinned.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#6B778C' }}>
                    {pinnedOnly ? 'No pinned initiatives. Click 📌 to pin one.' : 'No initiatives found.'}
                  </td>
                </tr>
              )}

              {pinned.map(i => (
                <InitiativeRow
                  key={i.key} initiative={i} pinned={true}
                  onPin={togglePin} onClick={() => navigate(`/initiative/${i.key}`)}
                  piName={piByInitiative[i.key]}
                  currentPiId={piIdByInitiative[i.key]}
                  pis={pis}
                  onAssignPI={(piId) => assignToPI(i.key, currentProject, piId)}
                />
              ))}

              {!pinnedOnly && unpinned.length > 0 && (
                <>
                  <tr>
                    <td colSpan={5}>
                      <div style={{ padding: '6px 12px', fontSize: 11, color: '#6B778C', fontWeight: 700, background: '#F4F5F7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        All Initiatives ({unpinned.length})
                      </div>
                    </td>
                  </tr>
                  {(showAll ? unpinned : unpinned.slice(0, 5)).map(i => (
                    <InitiativeRow key={i.key} initiative={i} pinned={false} onPin={togglePin} onClick={() => navigate(`/initiative/${i.key}`)} dimmed piName={piByInitiative[i.key]} />
                  ))}
                  {!showAll && unpinned.length > 5 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="show-more" onClick={() => setShowAll(true)}>
                          Show {unpinned.length - 5} more ↓
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}

              {pinnedOnly && unpinned.length > 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="show-more" onClick={() => setPinnedOnly(false)}>
                      Show all {unpinned.length} more initiatives ↓
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <SummaryBar label={projects.find(p => p.key === currentProject)?.name} stats={summaryStats} />
      </div>
    </div>
  )
}

const STATUS_COLORS = {
  'In Development': { bg: '#DEEBFF', color: '#0052CC' },
  'Done':           { bg: '#E3FCEF', color: '#006644' },
  'Blocked':        { bg: '#FFEBE6', color: '#BF2600' },
  'At Risk':        { bg: '#FFFAE6', color: '#974F0C' },
  'Backlog':        { bg: '#EBECF0', color: '#42526E' },
  'In Review':      { bg: '#EAE6FF', color: '#403294' },
}

function InitiativeRow({ initiative, pinned, onPin, onClick, dimmed, piName, currentPiId, pis, onAssignPI }) {
  const { key, summary, status, assignee } = initiative
  const badge = STATUS_COLORS[status] || { bg: '#EBECF0', color: '#42526E' }
  const [saving, setSaving] = useState(false)

  const handlePiChange = async (e) => {
    e.stopPropagation()
    setSaving(true)
    try { await onAssignPI(e.target.value || null) } finally { setSaving(false) }
  }

  return (
    <tr className={dimmed ? 'dimmed' : ''} style={{ cursor: 'pointer' }} onClick={onClick}>
      <td style={{ padding: '0 0 0 8px' }}>
        <button className={`init-row__pin ${pinned ? 'init-row__pin--active' : ''}`} onClick={(e) => onPin(e, key)} title={pinned ? 'Unpin' : 'Pin'}>
          📌
        </button>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px 8px 0' }}>
          <div style={{ width: 3, minHeight: 32, borderRadius: 2, background: badge.color, flexShrink: 0, opacity: 0.4 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{summary}</div>
            <div style={{ fontSize: 11, color: '#6B778C', marginTop: 1 }}>{key}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '8px 12px', fontSize: 12, color: '#42526E' }}>
        {assignee || <span style={{ color: '#97A0AF' }}>Unassigned</span>}
      </td>
      <td style={{ padding: '8px 12px' }}>
        <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: badge.bg, color: badge.color }}>
          {status}
        </span>
      </td>
      <td style={{ padding: '8px 12px' }} onClick={e => e.stopPropagation()}>
        {pinned && pis ? (
          <select className="pi-select" value={currentPiId || ''} onChange={handlePiChange} disabled={saving} title="Assign to a Program Increment">
            <option value="">— No PI —</option>
            {pis.map(pi => <option key={pi.id} value={pi.id}>{pi.name}</option>)}
          </select>
        ) : (
          piName
            ? <span style={{ fontSize: 11, background: '#EAE6FF', color: '#403294', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>{piName}</span>
            : <span style={{ color: '#DFE1E6', fontSize: 11 }}>—</span>
        )}
      </td>
    </tr>
  )
}
