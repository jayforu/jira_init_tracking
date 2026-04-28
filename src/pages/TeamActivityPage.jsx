import React, { useState } from 'react'
import useProjects from '../hooks/useProjects'
import { useTeamActivity, useTeamActivityPRs, useTeamActivityCommits } from '../hooks/useTeamActivity'

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

function StatCell({ value, color }) {
  return (
    <td style={{ textAlign: 'center', fontWeight: value > 0 ? 600 : 400, color: value > 0 ? (color || '#172B4D') : '#8993A4' }}>
      {value}
    </td>
  )
}

// ── Stories Table ─────────────────────────────────────────────────────────────

function StoriesSection({ stories }) {
  if (!stories.length) return <div className="pf-empty">No stories updated in this period.</div>
  return (
    <div className="ta-section">
      <table className="ta-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', width: 220 }}>Resource</th>
            <th>To Do</th>
            <th>In Progress</th>
            <th>Done</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {stories.map(r => (
            <tr key={r.name}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={r.name} />
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{r.name}</span>
                </div>
              </td>
              <StatCell value={r.stats.todo} color="#6B778C" />
              <StatCell value={r.stats.in_progress} color="#0052CC" />
              <StatCell value={r.stats.done} color="#00875A" />
              <td style={{ textAlign: 'center', fontWeight: 700, color: '#172B4D' }}>{r.stats.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Commits Table ─────────────────────────────────────────────────────────────

function CommitsSection({ commitsByAuthor }) {
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
              <td style={{ textAlign: 'center', fontWeight: 700, color: '#172B4D' }}>{r.commits}</td>
              <td style={{ textAlign: 'center', color: r.files_changed > 0 ? '#42526E' : '#8993A4' }}>{r.files_changed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── PRs Table ─────────────────────────────────────────────────────────────────

function PRsSection({ prsByAuthor }) {
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
              <StatCell value={r.prs.open} color="#0052CC" />
              <StatCell value={r.prs.merged} color="#00875A" />
              <StatCell value={r.prs.declined} color="#DE350B" />
              <td style={{ textAlign: 'center', fontWeight: 700, color: '#172B4D' }}>{r.prs.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Subtask Table ─────────────────────────────────────────────────────────────

function SubtaskTable({ rows, emptyMsg }) {
  if (!rows.length) return <div className="pf-empty">{emptyMsg}</div>
  return (
    <table className="ta-table">
      <thead>
        <tr>
          <th style={{ textAlign: 'left', width: 220 }}>Resource</th>
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
            <StatCell value={r.stats.todo} color="#6B778C" />
            <StatCell value={r.stats.in_progress} color="#0052CC" />
            <StatCell value={r.stats.done} color="#00875A" />
            <td style={{ textAlign: 'center', fontWeight: 700, color: '#172B4D' }}>{r.stats.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SubtasksSection({ devSubtasks, qaSubtasks }) {
  return (
    <div className="ta-section">
      <div className="ta-subsection">
        <h3 className="ta-subsection__title">Dev Subtasks</h3>
        <SubtaskTable rows={devSubtasks} emptyMsg="No dev subtasks in this period." />
      </div>
      <div className="ta-subsection" style={{ marginTop: 24 }}>
        <h3 className="ta-subsection__title">QA Sub-Tasks</h3>
        <SubtaskTable rows={qaSubtasks} emptyMsg="No QA sub-tasks in this period." />
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamActivityPage() {
  const { projects, loading: projLoading } = useProjects()

  const range = defaultRange()
  const [selectedProject, setSelectedProject] = useState(null)
  const [from, setFrom] = useState(range.from)
  const [to, setTo] = useState(range.to)
  const [activeTab, setActiveTab] = useState('stories')

  const project = selectedProject || projects[0]?.key || null

  const { data, loading, error } = useTeamActivity(project, from, to)
  const { prs, loading: prsLoading } = useTeamActivityPRs(project, from, to, activeTab === 'prs')
  const { commits, loading: commitsLoading } = useTeamActivityCommits(project, from, to, activeTab === 'commits')

  if (projLoading) return <div className="loading"><div className="spinner" /> Loading...</div>

  if (!projects.length) return (
    <div className="page">
      <div className="empty-state">
        <h3>No projects configured</h3>
        <p>Go to <a href="/settings">Settings</a> to add projects.</p>
      </div>
    </div>
  )

  return (
    <div>
      {/* Filter bar */}
      <div className="pf-filter-bar">
        <div className="pf-filter-group">
          <label className="pf-filter-label">PROJECT</label>
          <select
            className="pf-select"
            value={project || ''}
            onChange={e => setSelectedProject(e.target.value)}
          >
            {projects.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
          </select>
        </div>

        <div className="pf-filter-group">
          <label className="pf-filter-label">FROM</label>
          <input
            type="date"
            className="pf-select"
            value={from}
            max={to}
            onChange={e => setFrom(e.target.value)}
          />
        </div>

        <div className="pf-filter-group">
          <label className="pf-filter-label">TO</label>
          <input
            type="date"
            className="pf-select"
            value={to}
            min={from}
            onChange={e => setTo(e.target.value)}
          />
        </div>

        <div className="pf-filter-meta">
          <span>{fmtDate(from)} – {fmtDate(to)}</span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="tabs">
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
      </div>

      <div className="page">
        <div className="pf-page-header">
          <h1 className="pf-page-title">Team Activity</h1>
          <p className="pf-page-sub">
            {projects.find(p => p.key === project)?.name || project} · {fmtDate(from)} – {fmtDate(to)}
          </p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading && <div className="loading"><div className="spinner" /> Loading team activity...</div>}

        {!loading && data && activeTab === 'stories' && (
          <StoriesSection stories={data.stories} />
        )}

        {!loading && data && activeTab === 'subtasks' && (
          <SubtasksSection
            devSubtasks={data.dev_subtasks}
            qaSubtasks={data.qa_subtasks}
          />
        )}

        {activeTab === 'prs' && prsLoading && (
          <div className="loading"><div className="spinner" /> Fetching PR data...</div>
        )}

        {activeTab === 'prs' && !prsLoading && (
          <PRsSection prsByAuthor={prs || []} />
        )}

        {activeTab === 'commits' && commitsLoading && (
          <div className="loading"><div className="spinner" /> Fetching commit data...</div>
        )}

        {activeTab === 'commits' && !commitsLoading && (
          <CommitsSection commitsByAuthor={commits || []} />
        )}
      </div>
    </div>
  )
}
