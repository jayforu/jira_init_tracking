import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import usePIs from '../hooks/usePIs'
import usePIBoard from '../hooks/usePIBoard'

const HEALTH_COLOR = {
  Good:     '#36B37E',
  Done:     '#36B37E',
  'At Risk':'#FF991F',
  Blocked:  '#FF5630',
  'N/A':    '#DFE1E6',
}

const HEALTH_TEXT = {
  Good:     '#fff',
  Done:     '#fff',
  'At Risk':'#fff',
  Blocked:  '#fff',
  'N/A':    '#6B778C',
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function weeksBetween(start, end) {
  const ms = new Date(end) - new Date(start)
  return Math.round(ms / (1000 * 60 * 60 * 24 * 7))
}

function piProgress(startIso, endIso) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const today = new Date()
  if (today <= start) return 0
  if (today >= end) return 100
  return Math.round(((today - start) / (end - start)) * 100)
}

function todayOffset(startIso, endIso) {
  return piProgress(startIso, endIso)
}

function HealthBadge({ health }) {
  const bg = HEALTH_COLOR[health] || HEALTH_COLOR['N/A']
  const color = HEALTH_TEXT[health] || '#6B778C'
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: bg, color }}>
      {health || 'N/A'}
    </span>
  )
}

// ── Board View ──────────────────────────────────────────────────────────────

function BoardView({ board, available, availableEpics, onUnassign, onToggleSpillover, onAssign, onAssignEpic, onUnassignEpic, onToggleEpicSpillover }) {
  const [showAdd, setShowAdd] = useState(false)
  const [showAddEpics, setShowAddEpics] = useState(false)
  const [search, setSearch] = useState('')
  const [epicSearch, setEpicSearch] = useState('')
  const navigate = useNavigate()

  const { initiatives, standalone_epics = [] } = board
  const active = initiatives.filter(i => !i.spilled_over)
  const spilled = initiatives.filter(i => i.spilled_over)
  const activeEpics = standalone_epics.filter(e => !e.spilled_over)
  const spilledEpics = standalone_epics.filter(e => e.spilled_over)

  // Group active by project
  const byProject = useMemo(() => {
    const groups = {}
    active.forEach(i => {
      if (!groups[i.project_key]) groups[i.project_key] = []
      groups[i.project_key].push(i)
    })
    return groups
  }, [active])

  const healthOrder = { Blocked: 0, 'At Risk': 1, 'N/A': 2, Good: 3, Done: 4 }
  const sortedProjects = Object.keys(byProject).sort()

  const filteredAvailable = useMemo(() => {
    if (!search.trim()) return available
    return available.filter(i =>
      i.summary?.toLowerCase().includes(search.toLowerCase()) ||
      i.key?.toLowerCase().includes(search.toLowerCase())
    )
  }, [available, search])

  const filteredAvailableEpics = useMemo(() => {
    if (!epicSearch.trim()) return availableEpics
    return availableEpics.filter(e =>
      e.summary?.toLowerCase().includes(epicSearch.toLowerCase()) ||
      e.key?.toLowerCase().includes(epicSearch.toLowerCase()) ||
      e.initiative_key?.toLowerCase().includes(epicSearch.toLowerCase())
    )
  }, [availableEpics, epicSearch])

  const total = initiatives.length
  const blocked = initiatives.filter(i => i.health === 'Blocked').length
  const atRisk = initiatives.filter(i => i.health === 'At Risk').length
  const good = initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length

  return (
    <div>
      {/* PI Summary strip */}
      <div className="pi-summary-strip">
        <div className="pi-summary-stat"><span className="pi-summary-val">{total}</span><span className="pi-summary-key">Initiatives</span></div>
        <div className="pi-summary-divider" />
        <div className="pi-summary-stat"><span className="pi-summary-val" style={{ color: '#FF5630' }}>{blocked}</span><span className="pi-summary-key">Blocked</span></div>
        <div className="pi-summary-divider" />
        <div className="pi-summary-stat"><span className="pi-summary-val" style={{ color: '#FF991F' }}>{atRisk}</span><span className="pi-summary-key">At Risk</span></div>
        <div className="pi-summary-divider" />
        <div className="pi-summary-stat"><span className="pi-summary-val" style={{ color: '#36B37E' }}>{good}</span><span className="pi-summary-key">On Track</span></div>
        <div className="pi-summary-divider" />
        <div className="pi-summary-stat"><span className="pi-summary-val" style={{ color: '#FF991F' }}>{spilled.length}</span><span className="pi-summary-key">Spilled Over</span></div>
      </div>

      {/* Active initiatives by project */}
      {sortedProjects.length === 0 && spilled.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px' }}>
          <p>No initiatives assigned to this PI yet.</p>
        </div>
      ) : (
        <>
          {sortedProjects.map(proj => (
            <div key={proj} className="pi-project-group">
              <div className="pi-project-label">{proj}</div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Initiative</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {byProject[proj]
                    .sort((a, b) => (healthOrder[a.health] ?? 2) - (healthOrder[b.health] ?? 2))
                    .map(i => (
                      <tr key={i.initiative_key} style={{ cursor: 'pointer' }} onClick={() => navigate(`/initiative/${i.initiative_key}`)}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{i.summary}</div>
                          <div style={{ fontSize: 11, color: '#6B778C', marginTop: 2 }}>{i.initiative_key}</div>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>
                          {i.assignee || <span style={{ color: '#97A0AF' }}>Unassigned</span>}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: 12, color: '#42526E' }}>{i.status}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <HealthBadge health={i.health} />
                        </td>
                        <td style={{ padding: '10px 12px' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn--ghost btn--sm"
                              style={{ fontSize: 11 }}
                              onClick={() => onToggleSpillover(i.initiative_key, true)}
                              title="Mark as spilled to next PI"
                            >
                              Spill →
                            </button>
                            <button
                              className="btn btn--danger btn--sm"
                              style={{ fontSize: 11 }}
                              onClick={() => onUnassign(i.initiative_key)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Spilled over section */}
          {spilled.length > 0 && (
            <div className="pi-project-group">
              <div className="pi-project-label pi-project-label--spill">
                Spilled Over — Moving to Next PI ({spilled.length})
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Initiative</th>
                    <th>Project</th>
                    <th>Health</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spilled.map(i => (
                    <tr key={i.initiative_key} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigate(`/initiative/${i.initiative_key}`)}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#FF991F', fontWeight: 700 }}>→ Next PI</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{i.summary}</div>
                            <div style={{ fontSize: 11, color: '#6B778C', marginTop: 2 }}>{i.initiative_key}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>{i.project_key}</td>
                      <td style={{ padding: '10px 12px' }}><HealthBadge health={i.health} /></td>
                      <td style={{ padding: '10px 12px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn--ghost btn--sm"
                            style={{ fontSize: 11 }}
                            onClick={() => onToggleSpillover(i.initiative_key, false)}
                          >
                            ← Restore
                          </button>
                          <button
                            className="btn btn--danger btn--sm"
                            style={{ fontSize: 11 }}
                            onClick={() => onUnassign(i.initiative_key)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Standalone Epics section */}
      {standalone_epics.length > 0 && (
        <>
          {activeEpics.length > 0 && (
            <div className="pi-project-group">
              <div className="pi-project-label" style={{ color: '#5243AA' }}>
                Standalone Epics ({activeEpics.length})
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Epic</th>
                    <th>Initiative</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEpics.map(e => (
                    <tr key={e.epic_key}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{e.summary}</div>
                        <div style={{ fontSize: 11, color: '#6B778C', marginTop: 2 }}>{e.epic_key}</div>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>
                        {e.initiative_key
                          ? <><span style={{ color: '#6B778C' }}>{e.initiative_key}</span></>
                          : <span style={{ color: '#97A0AF' }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>
                        {e.assignee || <span style={{ color: '#97A0AF' }}>Unassigned</span>}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>{e.status}</td>
                      <td style={{ padding: '10px 12px' }}><HealthBadge health={e.health} /></td>
                      <td style={{ padding: '10px 12px' }} onClick={ev => ev.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn--ghost btn--sm"
                            style={{ fontSize: 11 }}
                            onClick={() => onToggleEpicSpillover(e.epic_key, true)}
                            title="Mark as spilled to next PI"
                          >
                            Spill →
                          </button>
                          <button
                            className="btn btn--danger btn--sm"
                            style={{ fontSize: 11 }}
                            onClick={() => onUnassignEpic(e.epic_key)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {spilledEpics.length > 0 && (
            <div className="pi-project-group">
              <div className="pi-project-label pi-project-label--spill">
                Spilled Epics — Moving to Next PI ({spilledEpics.length})
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Epic</th>
                    <th>Initiative</th>
                    <th>Health</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {spilledEpics.map(e => (
                    <tr key={e.epic_key} style={{ opacity: 0.8 }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#FF991F', fontWeight: 700 }}>→ Next PI</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{e.summary}</div>
                            <div style={{ fontSize: 11, color: '#6B778C', marginTop: 2 }}>{e.epic_key}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: '#42526E' }}>{e.initiative_key || '—'}</td>
                      <td style={{ padding: '10px 12px' }}><HealthBadge health={e.health} /></td>
                      <td style={{ padding: '10px 12px' }} onClick={ev => ev.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn--ghost btn--sm"
                            style={{ fontSize: 11 }}
                            onClick={() => onToggleEpicSpillover(e.epic_key, false)}
                          >
                            ← Restore
                          </button>
                          <button
                            className="btn btn--danger btn--sm"
                            style={{ fontSize: 11 }}
                            onClick={() => onUnassignEpic(e.epic_key)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add initiatives panel */}
      <div className="pi-add-panel">
        <button
          className="btn btn--ghost"
          style={{ fontSize: 13 }}
          onClick={() => setShowAdd(v => !v)}
        >
          {showAdd ? '▲ Hide' : '＋ Add Initiatives'}
        </button>

        {showAdd && (
          <div className="pi-add-content">
            <input
              className="toolbar__search"
              placeholder="Search available initiatives..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ marginBottom: 10, maxWidth: 400 }}
            />
            {filteredAvailable.length === 0 ? (
              <p style={{ color: '#6B778C', fontSize: 13, padding: '8px 0' }}>
                {available.length === 0
                  ? 'All synced initiatives are already in this PI.'
                  : 'No initiatives match your search.'}
              </p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Initiative</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Health</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvailable.slice(0, 20).map(i => (
                    <tr key={i.key}>
                      <td style={{ padding: '8px 12px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{i.summary || i.key}</div>
                        <div style={{ fontSize: 11, color: '#6B778C' }}>{i.key}</div>
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: 12, color: '#42526E' }}>{i.project_key}</td>
                      <td style={{ padding: '8px 12px', fontSize: 12, color: '#42526E' }}>{i.status}</td>
                      <td style={{ padding: '8px 12px' }}><HealthBadge health={i.health} /></td>
                      <td style={{ padding: '8px 12px' }}>
                        <button
                          className="btn btn--primary btn--sm"
                          style={{ fontSize: 11 }}
                          onClick={() => onAssign(i.key, i.project_key)}
                        >
                          + Add
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAvailable.length > 20 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '8px 12px', color: '#6B778C', fontSize: 12 }}>
                        {filteredAvailable.length - 20} more — refine your search to see them.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Add epics panel */}
      <div className="pi-add-panel">
        <button
          className="btn btn--ghost"
          style={{ fontSize: 13 }}
          onClick={() => setShowAddEpics(v => !v)}
        >
          {showAddEpics ? '▲ Hide' : '＋ Add Epics'}
        </button>

        {showAddEpics && (
          <div className="pi-add-content">
            <input
              className="toolbar__search"
              placeholder="Search by epic name, key, or initiative..."
              value={epicSearch}
              onChange={e => setEpicSearch(e.target.value)}
              style={{ marginBottom: 10, maxWidth: 400 }}
            />
            {filteredAvailableEpics.length === 0 ? (
              <p style={{ color: '#6B778C', fontSize: 13, padding: '8px 0' }}>
                {availableEpics.length === 0
                  ? 'No epics available to add (all are already in this PI via their initiative or direct assignment).'
                  : 'No epics match your search.'}
              </p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Epic</th>
                    <th>Initiative</th>
                    <th>Project</th>
                    <th>Health</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvailableEpics.slice(0, 20).map(e => (
                    <tr key={e.key}>
                      <td style={{ padding: '8px 12px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{e.summary || e.key}</div>
                        <div style={{ fontSize: 11, color: '#6B778C' }}>{e.key}</div>
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: 12, color: '#42526E' }}>{e.initiative_key || '—'}</td>
                      <td style={{ padding: '8px 12px', fontSize: 12, color: '#42526E' }}>{e.project_key}</td>
                      <td style={{ padding: '8px 12px' }}><HealthBadge health={e.health} /></td>
                      <td style={{ padding: '8px 12px' }}>
                        <button
                          className="btn btn--primary btn--sm"
                          style={{ fontSize: 11 }}
                          onClick={() => onAssignEpic(e.key)}
                        >
                          + Add
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredAvailableEpics.length > 20 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '8px 12px', color: '#6B778C', fontSize: 12 }}>
                        {filteredAvailableEpics.length - 20} more — refine your search to see them.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Timeline / Gantt View ───────────────────────────────────────────────────

function TimelineView({ board }) {
  const { pi, initiatives } = board
  const navigate = useNavigate()

  const today = new Date()
  const piStart = new Date(pi.start_date)
  const piEnd = new Date(pi.end_date)
  const progressPct = piProgress(pi.start_date, pi.end_date)
  const isPastEnd = today > piEnd
  const isBeforeStart = today < piStart
  const weeks = weeksBetween(pi.start_date, pi.end_date)

  // Generate week markers
  const weekMarkers = useMemo(() => {
    const markers = []
    const ms = piEnd - piStart
    let current = new Date(piStart)
    current.setDate(current.getDate() + 7)
    while (current < piEnd) {
      const pct = ((current - piStart) / ms) * 100
      markers.push({ pct, label: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })
      current = new Date(current)
      current.setDate(current.getDate() + 7)
    }
    return markers
  }, [pi.start_date, pi.end_date])

  const sortedInitiatives = [...initiatives].sort((a, b) => {
    const order = { Blocked: 0, 'At Risk': 1, 'N/A': 2, Good: 3, Done: 4 }
    return (order[a.health] ?? 2) - (order[b.health] ?? 2)
  })

  return (
    <div className="pi-timeline">
      {/* Timeline header */}
      <div className="pi-timeline__header">
        <div className="pi-timeline__label-col" />
        <div className="pi-timeline__track-col">
          <div className="pi-timeline__ruler">
            {/* Start label */}
            <span className="pi-timeline__date pi-timeline__date--start">{formatDate(pi.start_date)}</span>

            {/* Week tick marks */}
            {weekMarkers.map((m, i) => (
              <span
                key={i}
                className="pi-timeline__tick"
                style={{ left: `${m.pct}%` }}
                title={m.label}
              />
            ))}

            {/* PI progress fill */}
            <div
              className="pi-timeline__progress"
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />

            {/* Today line */}
            {!isPastEnd && !isBeforeStart && (
              <div className="pi-timeline__today" style={{ left: `${progressPct}%` }}>
                <span className="pi-timeline__today-label">Today</span>
              </div>
            )}

            {/* PI end boundary */}
            <div className="pi-timeline__end-line" />

            {/* End label */}
            <span className="pi-timeline__date pi-timeline__date--end">{formatDate(pi.end_date)}</span>
          </div>
        </div>
        <div className="pi-timeline__spill-col">
          <span style={{ fontSize: 10, color: '#FF991F', fontWeight: 700 }}>Spill zone</span>
        </div>
      </div>

      {/* Initiative rows */}
      {sortedInitiatives.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px' }}>
          <p>No initiatives assigned. Switch to Board view to add them.</p>
        </div>
      ) : (
        <div className="pi-timeline__rows">
          {sortedInitiatives.map(i => {
            const barColor = HEALTH_COLOR[i.health] || HEALTH_COLOR['N/A']
            return (
              <div key={i.initiative_key} className="pi-timeline__row">
                <div
                  className="pi-timeline__label-col"
                  onClick={() => navigate(`/initiative/${i.initiative_key}`)}
                  style={{ cursor: 'pointer' }}
                  title={i.summary}
                >
                  <div style={{ fontWeight: 600, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {i.summary}
                  </div>
                  <div style={{ fontSize: 10, color: '#6B778C' }}>{i.initiative_key} · {i.project_key}</div>
                </div>

                <div className="pi-timeline__track-col">
                  <div className="pi-timeline__bar-wrap">
                    {/* The bar: full PI width for non-spilled, truncated for spilled */}
                    <div
                      className={`pi-timeline__bar ${i.spilled_over ? 'pi-timeline__bar--spilled' : ''}`}
                      style={{ background: barColor, width: i.spilled_over ? '100%' : '100%', opacity: i.spilled_over ? 0.5 : 1 }}
                    />
                  </div>
                </div>

                <div className="pi-timeline__spill-col">
                  {i.spilled_over ? (
                    <div className="pi-timeline__spill-ext" style={{ background: barColor }}>
                      <span style={{ fontSize: 10, color: 'white', fontWeight: 700, padding: '0 6px' }}>→</span>
                    </div>
                  ) : null}
                </div>

                <div className="pi-timeline__health-col">
                  <HealthBadge health={i.health} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="pi-timeline__legend">
        <span className="pi-timeline__legend-item">
          <span className="pi-timeline__legend-dot" style={{ background: '#0052CC22', border: '1px solid #0052CC' }} />
          PI window
        </span>
        <span className="pi-timeline__legend-item">
          <span className="pi-timeline__legend-dot" style={{ background: '#0052CC' }} />
          Progress to today
        </span>
        <span className="pi-timeline__legend-item">
          <span className="pi-timeline__legend-dot" style={{ background: '#FF991F' }} />
          Spilled over
        </span>
        {Object.entries(HEALTH_COLOR).filter(([k]) => k !== 'Done').map(([label, color]) => (
          <span key={label} className="pi-timeline__legend-item">
            <span className="pi-timeline__legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function PIBoardPage() {
  const { pis, loading: pisLoading } = usePIs()
  const [activePiId, setActivePiId] = useState(null)
  const [view, setView] = useState('board') // 'board' | 'timeline'

  const currentPiId = activePiId || pis[0]?.id
  const { board, available, availableEpics, loading, error, assign, unassign, toggleSpillover, assignEpic, unassignEpic, toggleEpicSpillover } = usePIBoard(currentPiId)

  if (pisLoading) return <div className="loading"><div className="spinner" /> Loading PIs...</div>

  if (!pis.length) return (
    <div className="empty-state">
      <h3>No PIs configured</h3>
      <p>Go to Settings to create your first Program Increment.</p>
    </div>
  )

  const currentPI = pis.find(p => p.id === currentPiId)
  const weeks = currentPI ? weeksBetween(currentPI.start_date, currentPI.end_date) : 0
  const progress = currentPI ? piProgress(currentPI.start_date, currentPI.end_date) : 0

  return (
    <div>
      {/* PI Selector tabs */}
      <div className="tabs">
        {pis.map(pi => (
          <button
            key={pi.id}
            className={`tab ${currentPiId === pi.id ? 'tab--active' : ''}`}
            onClick={() => { setActivePiId(pi.id); setView('board') }}
          >
            {pi.name}
            <span className="tab__badge">
              {currentPiId === pi.id && board ? board.initiatives.length : '—'}
            </span>
          </button>
        ))}
      </div>

      <div className="page">
        {/* PI Header */}
        {currentPI && (
          <div className="page-header">
            <div style={{ flex: 1 }}>
              <h1 className="page-header__title">{currentPI.name}</h1>
              <span className="page-header__sub">
                {formatDate(currentPI.start_date)} – {formatDate(currentPI.end_date)}
                &nbsp;·&nbsp;{weeks} weeks
                {progress > 0 && progress < 100 && <>&nbsp;·&nbsp;<strong>{progress}%</strong> elapsed</>}
                {progress >= 100 && <>&nbsp;·&nbsp;<span style={{ color: '#FF991F' }}>PI complete</span></>}
                {progress === 0 && <>&nbsp;·&nbsp;<span style={{ color: '#6B778C' }}>Not started</span></>}
              </span>
            </div>

            {/* PI progress bar */}
            <div style={{ width: 200 }}>
              <div style={{ fontSize: 10, color: '#6B778C', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>PI Progress</div>
              <div className="progress-bar" style={{ height: 10 }}>
                <div
                  className="progress-bar__fill"
                  style={{ width: `${progress}%`, background: progress >= 100 ? '#FF991F' : '#0052CC' }}
                />
              </div>
            </div>

            {/* View switcher */}
            <div style={{ display: 'flex', gap: 0 }}>
              {[['board', 'Board'], ['timeline', 'Timeline']].map(([v, label], i, arr) => (
                <button
                  key={v}
                  className={`toggle-btn ${view === v ? 'toggle-btn--active' : ''}`}
                  style={{
                    borderRadius: i === 0 ? '4px 0 0 4px' : '0 4px 4px 0',
                    borderRight: i < arr.length - 1 ? 'none' : undefined,
                  }}
                  onClick={() => setView(v)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading PI data...</div>
        ) : board ? (
          view === 'board' ? (
            <BoardView
              board={board}
              available={available}
              availableEpics={availableEpics}
              onUnassign={unassign}
              onToggleSpillover={toggleSpillover}
              onAssign={assign}
              onAssignEpic={assignEpic}
              onUnassignEpic={unassignEpic}
              onToggleEpicSpillover={toggleEpicSpillover}
            />
          ) : (
            <TimelineView board={board} />
          )
        ) : null}
      </div>
    </div>
  )
}
