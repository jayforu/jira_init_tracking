import React, { useState, useEffect } from 'react'
import useProjects from '../hooks/useProjects'
import { useTeamActivity, useTeamActivityPRs, useTeamActivityCommits, useTeamActivityTrends, useBoardQuickFilters } from '../hooks/useTeamActivity'
import { useBoards, useSprints } from '../hooks/useAgile'

// ── Helpers ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#0052CC','#00875A','#6554C0','#FF5630','#FF991F','#00B8D9','#36B37E','#4C9AFF']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function toInputDate(date) {
  return date.toISOString().slice(0, 10)
}

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return { from: toInputDate(from), to: toInputDate(to) }
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: avatarColor(name), color: '#fff',
      fontSize: 11, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      {initials(name)}
    </div>
  )
}

// ── Stat Cell ─────────────────────────────────────────────────────────────────

function StatCell({ value, color, onClick }) {
  const clickable = value > 0 && onClick
  return (
    <td
      className={clickable ? 'ta-clickable' : undefined}
      onClick={clickable ? onClick : undefined}
      style={{ textAlign: 'center', fontWeight: value > 0 ? 600 : 400, color: value > 0 ? (color || '#172B4D') : '#8993A4' }}
    >
      {value}
    </td>
  )
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({ title, subtitle, items, renderRow, onClose }) {
  if (!items) return null
  return (
    <div className="ta-modal-backdrop" onClick={onClose}>
      <div className="ta-modal" onClick={e => e.stopPropagation()}>
        <div className="ta-modal__header">
          <div>
            <h3 className="ta-modal__title">{title}</h3>
            {subtitle && <div className="ta-modal__sub">{subtitle}</div>}
          </div>
          <button className="ta-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="ta-modal__body">
          {items.length === 0
            ? <div className="pf-empty">Nothing to show.</div>
            : items.map(renderRow)}
        </div>
      </div>
    </div>
  )
}

// ── Generic status-breakdown table — reused by Initiatives, Epics, Stories ──

function StatusTable({ rows, emptyMsg, resourceLabel = 'Resource', onCellClick }) {
  if (!rows.length) return <div className="pf-empty">{emptyMsg}</div>
  return (
    <div className="ta-section">
      <table className="ta-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: 220 }}>{resourceLabel}</th>
            <th>To Do</th>
            <th>In Progress</th>
            <th>Done</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.name}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={r.name} />
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                </div>
              </td>
              <StatCell value={r.stats.todo}        color="#6B778C" onClick={onCellClick && (() => onCellClick(r, 'todo'))} />
              <StatCell value={r.stats.in_progress} color="#0052CC" onClick={onCellClick && (() => onCellClick(r, 'in_progress'))} />
              <StatCell value={r.stats.done}        color="#00875A" onClick={onCellClick && (() => onCellClick(r, 'done'))} />
              <StatCell value={r.stats.total}                       onClick={onCellClick && (() => onCellClick(r, 'total'))} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Commits Table ─────────────────────────────────────────────────────────────

function CommitsSection({ commitsByAuthor, onClick }) {
  if (!commitsByAuthor.length) return <div className="pf-empty">No commits found in this period.</div>
  return (
    <div className="ta-section">
      <table className="ta-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: 220 }}>Author</th>
            <th>Commits</th>
            <th>Files Changed</th>
          </tr>
        </thead>
        <tbody>
          {commitsByAuthor.map(r => (
            <tr key={r.name}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={r.name} />
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                </div>
              </td>
              <td className={r.commits > 0 ? 'ta-clickable' : undefined} onClick={r.commits > 0 ? () => onClick(r) : undefined} style={{ textAlign: 'center', fontWeight: 700, color: '#172B4D' }}>{r.commits}</td>
              <td style={{ textAlign: 'center', color: r.files_changed > 0 ? '#42526E' : '#8993A4' }}>{r.files_changed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── PRs Table ─────────────────────────────────────────────────────────────────

function PRsSection({ prsByAuthor, onClick }) {
  if (!prsByAuthor.length) return <div className="pf-empty">No PRs found in this period.</div>
  return (
    <div className="ta-section">
      <table className="ta-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: 220 }}>Author</th>
            <th>Open</th>
            <th>Merged</th>
            <th>Declined</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {prsByAuthor.map(r => (
            <tr key={r.name}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={r.name} />
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                </div>
              </td>
              <StatCell value={r.prs.open}     color="#0052CC" onClick={() => onClick(r, 'OPEN')} />
              <StatCell value={r.prs.merged}   color="#00875A" onClick={() => onClick(r, 'MERGED')} />
              <StatCell value={r.prs.declined} color="#DE350B" onClick={() => onClick(r, 'DECLINED')} />
              <StatCell value={r.prs.total}                    onClick={() => onClick(r, 'all')} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Subtask Table ─────────────────────────────────────────────────────────────

function SubtasksSection({ devSubtasks, qaSubtasks, onCellClick }) {
  return (
    <div className="ta-section">
      <div className="ta-subsection">
        <h3 className="ta-subsection__title">Dev Subtasks</h3>
        <StatusTable rows={devSubtasks} emptyMsg="No dev subtasks in this period." onCellClick={(r, c) => onCellClick('Dev Subtasks', r, c)} />
      </div>
      <div className="ta-subsection" style={{ marginTop: 24 }}>
        <h3 className="ta-subsection__title">QA Sub-Tasks</h3>
        <StatusTable rows={qaSubtasks} emptyMsg="No QA sub-tasks in this period." onCellClick={(r, c) => onCellClick('QA Sub-Tasks', r, c)} />
      </div>
    </div>
  )
}

// ── Heatmap ──────────────────────────────────────────────────────────────────

function fmtMonth(yyyymm) {
  const [y, m] = yyyymm.split('-')
  const d = new Date(Number(y), Number(m) - 1, 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function heatColor(v, max, hue) {
  if (!v || !max) return 'transparent'
  const intensity = Math.min(v / max, 1)
  const lightness = 92 - intensity * 50  // 92% (light) → 42% (dark)
  return `hsl(${hue}, 65%, ${lightness}%)`
}

function HeatmapSection({ title, rows, months, hue, format }) {
  if (!rows.length) return (
    <div className="ta-heatmap-section">
      <h3 className="ta-heatmap__title">{title}</h3>
      <div className="pf-empty">No {title.toLowerCase()} in this period.</div>
    </div>
  )
  const max = Math.max(...rows.flatMap(r => r.counts))
  const isDark = v => v && (v / max) > 0.6
  return (
    <div className="ta-heatmap-section">
      <h3 className="ta-heatmap__title">{title}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="ta-heatmap">
          <thead>
            <tr>
              <th className="ta-heatmap__name">Person</th>
              {months.map(m => <th key={m}>{fmtMonth(m)}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.name}>
                <td className="ta-heatmap__name">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.name} />
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                  </div>
                </td>
                {r.counts.map((v, i) => (
                  <td
                    key={i}
                    className={!v ? 'ta-heatmap__cell--zero' : undefined}
                    style={{ background: heatColor(v, max, hue), color: isDark(v) ? '#fff' : undefined, fontWeight: v > 0 ? 600 : 400 }}
                  >
                    {format ? format(v) : (v || '—')}
                  </td>
                ))}
                <td className="ta-heatmap__total">{format ? format(r.total) : r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TrendsSection({ data }) {
  if (!data) return null
  return (
    <div className="ta-section">
      <HeatmapSection title="Commits"       rows={data.commits} months={data.months} hue={210} />
      <HeatmapSection title="Files Changed" rows={data.files}   months={data.months} hue={32}  />
      <HeatmapSection title="PRs"           rows={data.prs}     months={data.months} hue={145} />
    </div>
  )
}

function defaultTrendsRange() {
  const to = new Date()
  const from = new Date(to.getFullYear(), to.getMonth() - 2, 1)  // 3 calendar months
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }
}

const VALID_TABS = ['initiatives', 'epics', 'stories', 'subtasks', 'prs', 'commits', 'trends']

function getInitialTab() {
  if (typeof window === 'undefined') return 'initiatives'
  const hash = window.location.hash.replace(/^#/, '')
  return VALID_TABS.includes(hash) ? hash : 'initiatives'
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamActivityPage() {
  const { projects, loading: projLoading } = useProjects()

  const range = defaultRange()
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [selectedSprint, setSelectedSprint] = useState('') // '' = use date range
  // Draft = what's in the date inputs. Applied = what gets sent to the API.
  // Applied starts empty so the initial fetch is board-wide (no date filter);
  // clicking Search copies the drafts into applied state.
  const [from, setFrom] = useState(range.from)
  const [to, setTo] = useState(range.to)
  const [appliedFrom, setAppliedFrom] = useState('')
  const [appliedTo, setAppliedTo] = useState('')
  const [selectedQuickFilters, setSelectedQuickFilters] = useState([])
  const [quickFilterMenuOpen, setQuickFilterMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(getInitialTab)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeTab}`)
  }, [activeTab])

  const STATUS_LABEL = { todo: 'To Do', in_progress: 'In Progress', done: 'Done', total: '' }

  function openIssueModal(sectionLabel, row, category) {
    const filtered = category === 'total' ? row.items : row.items.filter(it => it.category === category)
    setModal({
      type: 'issues',
      title: `${row.name} — ${sectionLabel}${STATUS_LABEL[category] ? ' · ' + STATUS_LABEL[category] : ''}`,
      subtitle: `${filtered.length} item${filtered.length === 1 ? '' : 's'}`,
      items: filtered
    })
  }

  function openPRModal(row, status) {
    const filtered = status === 'all' ? row.items : row.items.filter(it => (it.status || '').toUpperCase() === status)
    setModal({
      type: 'prs',
      title: `${row.name} — PRs${status === 'all' ? '' : ' · ' + status}`,
      subtitle: `${filtered.length} PR${filtered.length === 1 ? '' : 's'}`,
      items: filtered
    })
  }

  function openCommitModal(row) {
    setModal({
      type: 'commits',
      title: `${row.name} — Commits`,
      subtitle: `${row.items.length} commits · ${row.files_changed} files changed`,
      items: row.items
    })
  }

  const project = selectedProject || projects[0]?.key || null
  const projectObj = projects.find(p => p.key === project)

  const { boards } = useBoards(project)
  const boardId = selectedBoard ?? projectObj?.tracked_board_id ?? boards[0]?.id ?? null
  const board = boards.find(b => b.id === boardId)

  const { sprints } = useSprints(board?.type === 'scrum' ? boardId : null)
  const { quickFilters: availableQuickFilters } = useBoardQuickFilters(boardId)

  // Reset quick-filter selection when the board changes — IDs aren't portable
  useEffect(() => {
    setSelectedQuickFilters([])
  }, [boardId])

  const params = selectedSprint
    ? { boardId, sprintId: selectedSprint, quickFilterIds: selectedQuickFilters }
    : { boardId, from: appliedFrom, to: appliedTo, quickFilterIds: selectedQuickFilters }

  const { data, loading, error }       = useTeamActivity(params)
  const { prs, loading: prsLoading }   = useTeamActivityPRs({ ...params, enabled: activeTab === 'prs' })
  const { commits, loading: commitsLoading } = useTeamActivityCommits({ ...params, enabled: activeTab === 'commits' })

  const trendsRange = defaultTrendsRange()
  const [trendsFrom, setTrendsFrom] = useState(trendsRange.from)
  const [trendsTo, setTrendsTo] = useState(trendsRange.to)
  // Trends always needs a date window for the month buckets — start with the
  // default 3-month range so the heatmap is populated on first load. Search
  // copies the drafts into the applied state.
  const [appliedTrendsFrom, setAppliedTrendsFrom] = useState(trendsRange.from)
  const [appliedTrendsTo, setAppliedTrendsTo] = useState(trendsRange.to)
  const { data: trendsData, loading: trendsLoading } = useTeamActivityTrends({ boardId, from: appliedTrendsFrom, to: appliedTrendsTo, quickFilterIds: selectedQuickFilters, enabled: activeTab === 'trends' })

  function applyTrendsFilter() {
    setAppliedTrendsFrom(trendsFrom)
    setAppliedTrendsTo(trendsTo)
  }

  if (projLoading) return <div className="loading"><div className="spinner" /> Loading...</div>

  if (!projects.length) return (
    <div className="page">
      <div className="empty-state">
        <h3>No projects configured</h3>
        <p>Go to <a href="/settings">Settings</a> to add projects.</p>
      </div>
    </div>
  )

  const activeSprint = sprints.find(s => s.id === Number(selectedSprint))
  const dateRangeApplied = appliedFrom && appliedTo
  const subtitle = activeSprint
    ? `${board?.name} · Sprint: ${activeSprint.name}`
    : dateRangeApplied
      ? `${board?.name || projectObj?.name} · ${fmtDate(appliedFrom)} – ${fmtDate(appliedTo)}`
      : `${board?.name || projectObj?.name} · Board-wide`

  function applyDateFilter() {
    setAppliedFrom(from)
    setAppliedTo(to)
  }
  function clearDateFilter() {
    setAppliedFrom('')
    setAppliedTo('')
  }

  function toggleQuickFilter(id) {
    setSelectedQuickFilters(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="pf-filter-bar">
        <div className="pf-filter-group">
          <label className="pf-filter-label">PROJECT</label>
          <select className="pf-select" value={project || ''} onChange={e => { setSelectedProject(e.target.value); setSelectedBoard(null); setSelectedSprint('') }}>
            {projects.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
          </select>
        </div>

        <div className="pf-filter-group">
          <label className="pf-filter-label">BOARD</label>
          <select className="pf-select" value={boardId || ''} onChange={e => { setSelectedBoard(Number(e.target.value)); setSelectedSprint('') }}>
            {!boards.length && <option value="">No boards available</option>}
            {boards.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
          </select>
        </div>

        {board?.type === 'scrum' && (
          <div className="pf-filter-group">
            <label className="pf-filter-label">SPRINT</label>
            <select className="pf-select" value={selectedSprint} onChange={e => setSelectedSprint(e.target.value)}>
              <option value="">— Use date range —</option>
              {sprints.map(s => <option key={s.id} value={s.id}>{s.name}{s.state === 'active' ? ' ● Active' : ''}</option>)}
            </select>
          </div>
        )}

        {availableQuickFilters.length > 0 && (
          <div className="pf-filter-group" style={{ position: 'relative' }}>
            <label className="pf-filter-label">QUICK FILTERS</label>
            <button
              type="button"
              className="pf-select"
              style={{ textAlign: 'left', minWidth: 180, cursor: 'pointer' }}
              onClick={() => setQuickFilterMenuOpen(o => !o)}
            >
              {selectedQuickFilters.length === 0
                ? 'None'
                : `${selectedQuickFilters.length} selected`}
              <span style={{ float: 'right', opacity: 0.5 }}>▾</span>
            </button>
            {quickFilterMenuOpen && (
              <>
                <div
                  onClick={() => setQuickFilterMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                />
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: 4,
                  minWidth: 240, maxHeight: 280, overflowY: 'auto',
                  background: '#fff', border: '1px solid #DFE1E6', borderRadius: 4,
                  boxShadow: '0 4px 12px rgba(9,30,66,0.15)', zIndex: 11, padding: 4
                }}>
                  {availableQuickFilters.map(qf => {
                    const checked = selectedQuickFilters.includes(qf.id)
                    return (
                      <label
                        key={qf.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '6px 8px', fontSize: 13, cursor: 'pointer',
                          borderRadius: 3
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F4F5F7'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleQuickFilter(qf.id)}
                        />
                        <span>{qf.name}</span>
                      </label>
                    )
                  })}
                  {selectedQuickFilters.length > 0 && (
                    <button
                      className="btn btn--ghost btn--sm"
                      style={{ width: '100%', marginTop: 4 }}
                      onClick={() => setSelectedQuickFilters([])}
                    >Clear all</button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {!selectedSprint && (
          <>
            <div className="pf-filter-group">
              <label className="pf-filter-label">FROM</label>
              <input type="date" className="pf-select" value={from} max={to} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="pf-filter-group">
              <label className="pf-filter-label">TO</label>
              <input type="date" className="pf-select" value={to} min={from} onChange={e => setTo(e.target.value)} />
            </div>
            <div className="pf-filter-group">
              <button className="btn btn--primary" onClick={applyDateFilter}>Search</button>
            </div>
            {dateRangeApplied && (
              <div className="pf-filter-group">
                <button className="btn btn--ghost" onClick={clearDateFilter}>Clear</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="tabs">
        <button
          className={`tab${activeTab === 'initiatives' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('initiatives')}
        >
          Initiatives
          {data?.initiatives?.length > 0 && (
            <span className="ta-count-badge">{data.initiatives.length}</span>
          )}
        </button>
        <button
          className={`tab${activeTab === 'epics' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('epics')}
        >
          Epics
          {data?.epics?.length > 0 && (
            <span className="ta-count-badge">{data.epics.length}</span>
          )}
        </button>
        <button
          className={`tab${activeTab === 'stories' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          Stories
          {data?.stories?.length > 0 && (
            <span className="ta-count-badge">{data.stories.length}</span>
          )}
        </button>
        <button
          className={`tab${activeTab === 'subtasks' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('subtasks')}
        >
          Subtasks
          {(data?.dev_subtasks?.length > 0 || data?.qa_subtasks?.length > 0) && (
            <span className="ta-count-badge">
              {(data?.dev_subtasks?.length || 0) + (data?.qa_subtasks?.length || 0)}
            </span>
          )}
        </button>
        <button
          className={`tab${activeTab === 'prs' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('prs')}
        >
          PRs
          {prs?.length > 0 && (
            <span className="ta-count-badge">{prs.length}</span>
          )}
        </button>
        <button
          className={`tab${activeTab === 'commits' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('commits')}
        >
          Commits
          {commits?.length > 0 && (
            <span className="ta-count-badge">{commits.length}</span>
          )}
        </button>
        <button
          className={`tab${activeTab === 'trends' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
      </div>

      <div className="page">
        <div className="pf-page-header">
          <h1 className="pf-page-title">Team Activity</h1>
          <p className="pf-page-sub">{subtitle}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading && <div className="loading"><div className="spinner" /> Loading team activity...</div>}

        {!loading && data && activeTab === 'initiatives' && (
          <StatusTable rows={data.initiatives} emptyMsg="No initiatives associated with work in this period." resourceLabel="Initiative Owner" onCellClick={(r, c) => openIssueModal('Initiatives', r, c)} />
        )}

        {!loading && data && activeTab === 'epics' && (
          <StatusTable rows={data.epics} emptyMsg="No epics with active work in this period." resourceLabel="Epic Owner" onCellClick={(r, c) => openIssueModal('Epics', r, c)} />
        )}

        {!loading && data && activeTab === 'stories' && (
          <StatusTable rows={data.stories} emptyMsg="No stories updated in this period." onCellClick={(r, c) => openIssueModal('Stories', r, c)} />
        )}

        {!loading && data && activeTab === 'subtasks' && (
          <SubtasksSection
            devSubtasks={data.dev_subtasks}
            qaSubtasks={data.qa_subtasks}
            onCellClick={(label, r, c) => openIssueModal(label, r, c)}
          />
        )}

        {activeTab === 'prs' && prsLoading && (
          <div className="loading"><div className="spinner" /> Fetching PR data...</div>
        )}

        {activeTab === 'prs' && !prsLoading && (
          <PRsSection prsByAuthor={prs || []} onClick={openPRModal} />
        )}

        {activeTab === 'commits' && commitsLoading && (
          <div className="loading"><div className="spinner" /> Fetching commit data...</div>
        )}

        {activeTab === 'commits' && !commitsLoading && (
          <CommitsSection commitsByAuthor={commits || []} onClick={openCommitModal} />
        )}

        {activeTab === 'trends' && (
          <>
            <div className="pf-filter-bar" style={{ marginBottom: 0 }}>
              <div className="pf-filter-group">
                <label className="pf-filter-label">FROM</label>
                <input type="date" className="pf-select" value={trendsFrom} max={trendsTo} onChange={e => setTrendsFrom(e.target.value)} />
              </div>
              <div className="pf-filter-group">
                <label className="pf-filter-label">TO</label>
                <input type="date" className="pf-select" value={trendsTo} min={trendsFrom} onChange={e => setTrendsTo(e.target.value)} />
              </div>
              <div className="pf-filter-group">
                <button className="btn btn--primary" onClick={applyTrendsFilter}>Search</button>
              </div>
              <div className="pf-filter-meta">
                <span>This may take 30-60s on first load. Cached for 10 min.</span>
              </div>
            </div>
            {trendsLoading && <div className="loading"><div className="spinner" /> Building trends — fetching dev activity for all issues in range...</div>}
            {!trendsLoading && trendsData && <TrendsSection data={trendsData} />}
          </>
        )}
      </div>

      {modal && (
        <DetailModal
          title={modal.title}
          subtitle={modal.subtitle}
          items={modal.items}
          onClose={() => setModal(null)}
          renderRow={item => {
            if (modal.type === 'issues') {
              return (
                <div className="ta-modal__row" key={item.key}>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.key}</a>
                  <div style={{ flex: 1 }}>
                    <div className="ta-modal__row-summary">{item.summary}</div>
                    <div className="ta-modal__row-meta">{item.status}</div>
                  </div>
                </div>
              )
            }
            if (modal.type === 'prs') {
              return (
                <div className="ta-modal__row" key={item.url}>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.issue_key}</a>
                  <div style={{ flex: 1 }}>
                    <div className="ta-modal__row-summary">{item.title}</div>
                    <div className="ta-modal__row-meta">{item.status} · {item.last_update ? new Date(item.last_update).toLocaleDateString() : ''}</div>
                  </div>
                </div>
              )
            }
            if (modal.type === 'commits') {
              return (
                <div className="ta-modal__row" key={item.id + item.url}>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.id}</a>
                  <div style={{ flex: 1 }}>
                    <div className="ta-modal__row-summary">{item.message?.split('\n')[0]}</div>
                    <div className="ta-modal__row-meta">
                      {item.issue_key} · {item.repo} · {item.file_count} file{item.file_count === 1 ? '' : 's'} · {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
      )}
    </div>
  )
}
