import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import usePins from '../hooks/usePins'
import useInitiatives from '../hooks/useInitiatives'
import useSyncStatus from '../hooks/useSyncStatus'
import usePIAssignments from '../hooks/usePIAssignments'
import usePIs from '../hooks/usePIs'
import HealthChip from '../components/HealthChip'
import SummaryBar from '../components/SummaryBar'

const ACCENT = { Good: '#36B37E', Done: '#36B37E', 'At Risk': '#FF991F', Blocked: '#FF5630', 'N/A': '#DFE1E6' }

function timeSince(date) {
  if (!date) return null
  const mins = Math.round((Date.now() - date) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} min ago`
}

export default function InitiativeListPage() {
  const navigate = useNavigate()
  const { projects, loading: projLoading } = useProjects()
  const [activeProject, setActiveProject] = useState(null)
  const [search, setSearch] = useState('')
  const [pinnedOnly, setPinnedOnly] = useState(false)
  const [showDone, setShowDone] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const currentProject = activeProject || projects[0]?.key
  const { initiatives, loading, error, reload } = useInitiatives(currentProject, showDone)
  const { pins, pin, unpin, isPinned } = usePins(currentProject)
  const { syncState, triggerSync } = useSyncStatus(currentProject)
  const { piByInitiative, piIdByInitiative, assignToPI } = usePIAssignments()
  const { pis } = usePIs()

  // Reload initiatives after sync completes
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

  const pinned = filtered.filter(i => isPinned(i.key))
  const unpinned = filtered.filter(i => !isPinned(i.key))
  const visible = pinnedOnly ? pinned : [...pinned, ...unpinned]

  const togglePin = async (e, key) => {
    e.stopPropagation()
    isPinned(key) ? await unpin(key) : await pin(key)
  }

  const summaryStats = [
    { label: 'Total Initiatives', value: initiatives.length },
    { label: 'Pinned', value: pins.length },
    { label: 'Blocked', value: initiatives.filter(i => i.health === 'Blocked').length, color: 'block' },
    { label: 'At Risk', value: initiatives.filter(i => i.health === 'At Risk').length, color: 'risk' },
    { label: 'Good', value: initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length, color: 'good' }
  ]

  if (projLoading) return <div className="loading"><div className="spinner" /> Loading projects...</div>

  if (!projects.length) return (
    <div className="empty-state">
      <h3>No projects configured</h3>
      <p>Go to <Link to="/settings">Settings</Link> to add a Jira project.</p>
    </div>
  )

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
              {visible.length === 0 && (
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
    try {
      await onAssignPI(e.target.value || null)
    } finally {
      setSaving(false)
    }
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
          <select
            className="pi-select"
            value={currentPiId || ''}
            onChange={handlePiChange}
            disabled={saving}
            title="Assign to a Program Increment"
          >
            <option value="">— No PI —</option>
            {pis.map(pi => (
              <option key={pi.id} value={pi.id}>{pi.name}</option>
            ))}
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
