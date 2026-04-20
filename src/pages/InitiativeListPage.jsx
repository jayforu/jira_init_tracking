import React, { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import usePins from '../hooks/usePins'
import useInitiatives from '../hooks/useInitiatives'
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
  const [pinnedOnly, setPinnedOnly] = useState(true)
  const [showDone, setShowDone] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const currentProject = activeProject || projects[0]?.key
  const { initiatives, loading, error, lastSynced, reload } = useInitiatives(currentProject, showDone)
  const { pins, pin, unpin, isPinned } = usePins(currentProject)

  const filtered = useMemo(() => {
    return initiatives.filter(i => {
      if (!showDone && i.statusCategory === 'Done') return false
      if (search && !i.summary.toLowerCase().includes(search.toLowerCase())) return false
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
              {lastSynced && ` · Last synced ${timeSince(lastSynced)}`}
            </span>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={reload}>↺ Refresh</button>
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
                <th>Epics</th>
                <th>Dev Progress</th>
                <th>Tests</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6B778C' }}>
                    {pinnedOnly ? 'No pinned initiatives. Click 📌 to pin one.' : 'No initiatives found.'}
                  </td>
                </tr>
              )}

              {pinned.map(i => (
                <InitiativeRow key={i.key} initiative={i} pinned={true} onPin={togglePin} onClick={() => navigate(`/initiative/${i.key}`)} />
              ))}

              {!pinnedOnly && unpinned.length > 0 && (
                <>
                  <tr>
                    <td colSpan={6}>
                      <div style={{ padding: '6px 12px', fontSize: 11, color: '#6B778C', fontWeight: 700, background: '#F4F5F7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        All Initiatives ({unpinned.length})
                      </div>
                    </td>
                  </tr>
                  {(showAll ? unpinned : unpinned.slice(0, 5)).map(i => (
                    <InitiativeRow key={i.key} initiative={i} pinned={false} onPin={togglePin} onClick={() => navigate(`/initiative/${i.key}`)} dimmed />
                  ))}
                  {!showAll && unpinned.length > 5 && (
                    <tr>
                      <td colSpan={6}>
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
                  <td colSpan={6}>
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

function InitiativeRow({ initiative, pinned, onPin, onClick, dimmed }) {
  const { key, summary, status } = initiative
  return (
    <tr className={dimmed ? 'dimmed' : ''} style={{ cursor: 'pointer' }} onClick={onClick}>
      <td style={{ padding: '0 0 0 8px' }}>
        <button className={`init-row__pin ${pinned ? 'init-row__pin--active' : ''}`} onClick={(e) => onPin(e, key)} title={pinned ? 'Unpin' : 'Pin'}>
          📌
        </button>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px 12px 0' }}>
          <div style={{ width: 4, minHeight: 44, borderRadius: 2, background: '#DFE1E6', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{summary}</div>
            <div style={{ fontSize: 11, color: '#6B778C' }}>{key}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px' }}>—</td>
      <td style={{ padding: '12px' }}>—</td>
      <td style={{ padding: '12px' }}>—</td>
      <td style={{ padding: '12px' }}>
        <span style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: 12,
          fontSize: 11, fontWeight: 700,
          background: '#DEEBFF', color: '#0052CC'
        }}>{status}</span>
      </td>
    </tr>
  )
}
