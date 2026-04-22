import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import usePIs from '../hooks/usePIs'
import useProjects from '../hooks/useProjects'
import usePortfolio from '../hooks/usePortfolio'

// ── Constants ────────────────────────────────────────────────────────────────

const HEALTH_COLOR = {
  Good:      { bg: '#E3FCEF', text: '#006644', bar: '#36B37E', border: '#ABF5D1' },
  Done:      { bg: '#E3FCEF', text: '#006644', bar: '#36B37E', border: '#ABF5D1' },
  'At Risk': { bg: '#FFFAE6', text: '#974F0C', bar: '#FF8B00', border: '#FFE380' },
  Blocked:   { bg: '#FFEBE6', text: '#BF2600', bar: '#DE350B', border: '#FF8F73' },
  'N/A':     { bg: '#F4F5F7', text: '#6B778C', bar: '#DFE1E6', border: '#DFE1E6' },
}

const LOAD_COLOR = {
  high:   { bg: '#FFEBE6', text: '#BF2600', bar: '#DE350B', label: 'HIGH' },
  medium: { bg: '#FFFAE6', text: '#974F0C', bar: '#FF8B00', label: 'MEDIUM' },
  low:    { bg: '#E3FCEF', text: '#006644', bar: '#36B37E', label: 'LOW' },
}

const AVATAR_COLORS = ['#0052CC','#00875A','#6554C0','#FF5630','#FF991F','#00B8D9','#36B37E','#4C9AFF']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function isActivePi(pi) {
  const now = new Date()
  return new Date(pi.start_date) <= now && now <= new Date(pi.end_date)
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, color, barPct, barColor, warn }) {
  return (
    <div className={`pf-kpi-card${warn ? ' pf-kpi-card--warn' : ''}`}>
      <div className="pf-kpi-card__label">{label}</div>
      <div className="pf-kpi-card__value" style={color ? { color } : {}}>{value}</div>
      {sub && <div className="pf-kpi-card__sub" style={color ? { color } : {}}>{sub}</div>}
      {barPct != null && (
        <div className="progress-bar" style={{ marginTop: 6, height: 5 }}>
          <div className="progress-bar__fill" style={{ width: `${barPct}%`, background: barColor || '#0052CC' }} />
        </div>
      )}
    </div>
  )
}

// ── Initiative Progress Table (Overview) ─────────────────────────────────────

function InitiativeProgressTable({ initiatives, piElapsed, navigate }) {
  if (!initiatives.length) return (
    <div className="pf-empty">No initiatives in this PI.</div>
  )
  return (
    <div className="pf-init-table">
      <div className="pf-init-table__header">
        <span style={{ flex: '0 0 180px' }}>Initiative</span>
        <span style={{ flex: '0 0 72px' }}>Health</span>
        <span style={{ flex: 1 }}>Dev Progress</span>
        <span style={{ flex: '0 0 56px', textAlign: 'right' }}>Tests</span>
        <span style={{ flex: '0 0 52px', textAlign: 'right' }}>Epics</span>
        <span style={{ flex: '0 0 80px', textAlign: 'right' }}>PI Pace</span>
      </div>
      {initiatives.map(i => {
        const hc = HEALTH_COLOR[i.health] || HEALTH_COLOR['N/A']
        const pace = i.devPercent - piElapsed
        const paceColor = pace >= 10 ? '#36B37E' : pace >= -5 ? '#FF8B00' : '#DE350B'
        return (
          <div
            key={i.key}
            className="pf-init-row"
            style={{ borderLeftColor: hc.bar }}
            onClick={() => navigate(`/initiative/${i.key}`)}
          >
            <div style={{ flex: '0 0 180px', minWidth: 0 }}>
              <div className="pf-init-row__name" title={i.summary}>{i.summary}</div>
              <div className="pf-init-row__key">
                {i.key}
                {i.spilled_over && <span className="pf-spill-tag">→ Next PI</span>}
                <span className="pf-project-tag">{i.project_key}</span>
              </div>
            </div>
            <div style={{ flex: '0 0 72px' }}>
              <span className="pf-health-badge" style={{ background: hc.bg, color: hc.text }}>
                {i.health}
              </span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <div className="progress-bar" style={{ height: 10 }}>
                <div className="progress-bar__fill" style={{ width: `${i.devPercent}%`, background: hc.bar }} />
              </div>
              {/* PI elapsed marker */}
              <div
                className="pf-elapsed-marker"
                style={{ left: `${Math.min(piElapsed, 99)}%` }}
                title={`PI elapsed: ${piElapsed}%`}
              />
              <div className="pf-init-row__pct">{i.devPercent}%</div>
            </div>
            <div style={{ flex: '0 0 56px', textAlign: 'right', fontSize: 12 }}>
              {i.testTotal === 0
                ? <span style={{ color: '#97A0AF' }}>—</span>
                : <span style={{ color: (i.testPassRate ?? 0) >= 80 ? '#36B37E' : '#FF8B00' }}>{i.testPassRate}%</span>
              }
            </div>
            <div style={{ flex: '0 0 52px', textAlign: 'right', fontSize: 12 }}>
              {i.epicCount > 0 ? `${i.goodEpics}/${i.epicCount}` : <span style={{ color: '#97A0AF' }}>—</span>}
            </div>
            <div style={{ flex: '0 0 80px', textAlign: 'right' }}>
              <span className="pf-pace-chip" style={{ color: paceColor, background: paceColor + '18' }}>
                {pace > 0 ? `+${pace}%` : `${pace}%`}
              </span>
            </div>
          </div>
        )
      })}
      <div className="pf-init-table__legend">
        <span className="pf-legend-marker" />
        <span>PI elapsed ({piElapsed}%)</span>
        <span style={{ marginLeft: 16, color: '#36B37E' }}>● Ahead</span>
        <span style={{ marginLeft: 10, color: '#FF8B00' }}>● Near</span>
        <span style={{ marginLeft: 10, color: '#DE350B' }}>● Behind</span>
      </div>
    </div>
  )
}

// ── Resource Load Summary (Overview right column) ─────────────────────────────

function ResourceLoadSummary({ resources }) {
  if (!resources.length) return <div className="pf-empty">No resource data yet.</div>
  return (
    <div className="pf-resource-summary">
      {resources.slice(0, 8).map(r => {
        const lc = LOAD_COLOR[r.load_level]
        const bg = avatarColor(r.name)
        return (
          <div key={r.name} className="pf-resource-summary-row">
            <div className="pf-avatar" style={{ background: bg }}>{initials(r.name)}</div>
            <div className="pf-resource-summary-row__info">
              <div className="pf-resource-summary-row__name">{r.name}</div>
              <div className="pf-resource-summary-row__meta">
                {r.epics_owned.length} epic{r.epics_owned.length !== 1 ? 's' : ''} owned
                {r.epics_contributing.length > 0 && ` · ${r.epics_contributing.length} contrib`}
                {' · '}{r.stories_open} open tasks
              </div>
            </div>
            <span className="pf-load-badge" style={{ background: lc.bg, color: lc.text }}>{lc.label}</span>
          </div>
        )
      })}
      {resources.length > 8 && (
        <div style={{ textAlign: 'center', fontSize: 11, color: '#6B778C', padding: '8px 0' }}>
          +{resources.length - 8} more people on Resources tab
        </div>
      )}
    </div>
  )
}

// ── Needs Attention (Overview bottom) ─────────────────────────────────────────

function NeedsAttention({ initiatives, navigate }) {
  const items = initiatives.filter(i => i.health === 'Blocked' || i.health === 'At Risk' || i.spilled_over).slice(0, 3)
  if (!items.length) return (
    <div className="pf-all-good">
      <span style={{ color: '#36B37E', fontWeight: 700 }}>✓</span> All initiatives on track
    </div>
  )
  return (
    <div className="pf-attention-row">
      {items.map(i => {
        const hc = HEALTH_COLOR[i.health] || HEALTH_COLOR['N/A']
        const reasons = []
        if (i.blockedEpics > 0) reasons.push(`${i.blockedEpics} epic${i.blockedEpics > 1 ? 's' : ''} blocked`)
        if (i.atRiskEpics  > 0 && i.health !== 'Blocked') reasons.push(`${i.atRiskEpics} at risk`)
        if (i.testTotal > 0 && (i.testPassRate ?? 100) < 60) reasons.push(`${i.testPassRate}% test pass`)
        if (i.spilled_over) reasons.push('spill risk')
        return (
          <div
            key={i.key}
            className="pf-attention-card"
            style={{ borderTopColor: hc.bar, background: hc.bg + 'AA' }}
            onClick={() => navigate(`/initiative/${i.key}`)}
          >
            <div className="pf-attention-card__header">
              <span className="pf-health-badge" style={{ background: hc.bg, color: hc.text }}>{i.health}</span>
              <span className="pf-attention-card__name">{i.summary}</span>
            </div>
            <div className="pf-attention-card__key">{i.key} · {i.assignee || 'Unassigned'} · {i.project_key}</div>
            {reasons.length > 0 && (
              <div className="pf-attention-card__reasons">{reasons.join(' · ')}</div>
            )}
            <div className="pf-attention-card__metrics">
              <span>Dev {i.devPercent}%</span>
              {i.testTotal > 0 && <span>Tests {i.testPassRate}%</span>}
              <span>{i.epicCount} epics</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ data, navigate }) {
  const { pi, initiatives, resources } = data
  const { elapsed } = pi

  const kpi = useMemo(() => {
    const total   = initiatives.length
    const blocked = initiatives.filter(i => i.health === 'Blocked').length
    const atRisk  = initiatives.filter(i => i.health === 'At Risk').length
    const good    = initiatives.filter(i => i.health === 'Good' || i.health === 'Done').length
    const spilled = initiatives.filter(i => i.spilled_over).length
    const testTotal = initiatives.reduce((s, i) => s + (i.testTotal || 0), 0)
    const testPass  = initiatives.reduce((s, i) => s + (i.testPass  || 0), 0)
    const testRate  = testTotal > 0 ? Math.round(testPass / testTotal * 100) : null
    const avgDev = total > 0
      ? Math.round(initiatives.reduce((s, i) => s + i.devPercent, 0) / total)
      : 0
    return { total, blocked, atRisk, good, spilled, testRate, avgDev }
  }, [initiatives])

  const devPace = kpi.avgDev - elapsed
  const devPaceColor = devPace >= 10 ? '#36B37E' : devPace >= -5 ? '#FF8B00' : '#DE350B'
  const devPaceSub = devPace > 0 ? `+${devPace}% ahead of PI pace` : devPace < 0 ? `${devPace}% behind PI pace` : 'On pace'

  return (
    <>
      <div className="pf-kpi-strip">
        <KpiCard
          label="PI Time Elapsed"
          value={`${elapsed}%`}
          sub={`${Math.round(elapsed / 100 * totalDays(pi))} of ${totalDays(pi)} days`}
          barPct={elapsed}
          barColor="#0052CC"
        />
        <KpiCard
          label="Avg Dev Completion"
          value={`${kpi.avgDev}%`}
          sub={devPaceSub}
          color={devPaceColor}
          barPct={kpi.avgDev}
          barColor={devPaceColor}
        />
        <KpiCard
          label="Initiative Health"
          value={kpi.total}
          sub={`${kpi.blocked} blocked · ${kpi.atRisk} at risk · ${kpi.good} good`}
          color={kpi.blocked > 0 ? '#DE350B' : kpi.atRisk > 0 ? '#FF8B00' : '#36B37E'}
        />
        <KpiCard
          label="Test Pass Rate"
          value={kpi.testRate != null ? `${kpi.testRate}%` : '—'}
          barPct={kpi.testRate ?? 0}
          barColor={kpi.testRate >= 80 ? '#36B37E' : kpi.testRate >= 60 ? '#FF8B00' : '#DE350B'}
        />
        <KpiCard
          label="Spill Risk"
          value={kpi.spilled}
          sub={kpi.spilled > 0 ? 'initiatives may spill' : 'None flagged'}
          color={kpi.spilled > 0 ? '#FF8B00' : '#36B37E'}
          warn={kpi.spilled > 0}
        />
      </div>

      <div className="pf-overview-layout">
        <div className="pf-panel">
          <div className="pf-panel__title">Initiative Progress</div>
          <div className="pf-panel__sub">Dev completion vs PI elapsed ({elapsed}%) · click to open</div>
          <InitiativeProgressTable initiatives={initiatives} piElapsed={elapsed} navigate={navigate} />
        </div>
        <div className="pf-panel">
          <div className="pf-panel__title">Resource Load</div>
          <div className="pf-panel__sub">By person across all epics — <a href="#resources" style={{ color: '#0052CC' }}>see full breakdown ↓</a></div>
          <ResourceLoadSummary resources={resources} />
        </div>
      </div>

      <div className="pf-panel" style={{ marginTop: 16 }}>
        <div className="pf-panel__title">Needs Attention</div>
        <div className="pf-panel__sub">Initiatives requiring action · blocked first</div>
        <NeedsAttention initiatives={initiatives} navigate={navigate} />
      </div>
    </>
  )
}

function totalDays(pi) {
  return Math.round((new Date(pi.end_date) - new Date(pi.start_date)) / 86400000)
}

// ── Epic Tag (Resources tab) ──────────────────────────────────────────────────

function EpicTag({ epic, owned }) {
  const hc = HEALTH_COLOR[epic.health] || HEALTH_COLOR['N/A']
  return (
    <span
      className="pf-epic-tag"
      style={{ borderColor: hc.bar, background: hc.bg, color: hc.text }}
      title={epic.summary}
    >
      <span className="pf-epic-tag__key">{epic.key}</span>
      {owned && <span className="pf-epic-tag__owner">owner</span>}
    </span>
  )
}

// ── Person Row (Resources tab) ────────────────────────────────────────────────

function PersonRow({ resource }) {
  const { name, epics_owned, epics_contributing, stories_total, stories_done, stories_open, load_score, load_level, initiatives } = resource
  const lc = LOAD_COLOR[load_level]
  const bg = avatarColor(name)
  const MAX_SCORE = 40

  return (
    <div className="pf-person-row" style={{ borderLeftColor: lc.bar }}>
      {/* Avatar + name */}
      <div className="pf-person-row__who">
        <div className="pf-avatar pf-avatar--lg" style={{ background: bg }}>{initials(name)}</div>
        <div>
          <div className="pf-person-row__name">{name}</div>
          <span className="pf-load-badge" style={{ background: lc.bg, color: lc.text }}>{lc.label} LOAD</span>
        </div>
      </div>

      {/* Epics */}
      <div className="pf-person-row__epics">
        {epics_owned.map(e => <EpicTag key={e.key} epic={e} owned />)}
        {epics_contributing.map(e => <EpicTag key={e.key} epic={e} owned={false} />)}
        {(epics_owned.length + epics_contributing.length) === 0 && (
          <span style={{ color: '#97A0AF', fontSize: 11 }}>Stories/subtasks only</span>
        )}
      </div>

      {/* Stories bar */}
      <div className="pf-person-row__stories">
        <div style={{ fontSize: 10, color: '#6B778C', marginBottom: 4 }}>
          {stories_done} done · <span style={{ color: stories_open > 0 ? lc.bar : '#36B37E' }}>{stories_open} open</span> of {stories_total}
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-bar__fill" style={{ width: `${stories_total > 0 ? Math.round(stories_done / stories_total * 100) : 0}%`, background: '#36B37E' }} />
        </div>
        <div style={{ fontSize: 10, color: '#97A0AF', marginTop: 2 }}>
          across {epics_owned.length + epics_contributing.length} epic{epics_owned.length + epics_contributing.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Open count */}
      <div className="pf-person-row__open">
        <span style={{ fontSize: 22, fontWeight: 700, color: lc.bar }}>{stories_open}</span>
        <span style={{ fontSize: 11, color: '#6B778C', marginLeft: 4 }}>open</span>
      </div>

      {/* Load score */}
      <div className="pf-person-row__score">
        <div style={{ fontSize: 10, color: '#6B778C', marginBottom: 2 }}>
          ({epics_owned.length}×{4}) + {stories_open} = <strong>{load_score}</strong>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-bar__fill" style={{ width: `${Math.min(Math.round(load_score / MAX_SCORE * 100), 100)}%`, background: lc.bar }} />
        </div>
        <div style={{ fontSize: 10, color: '#97A0AF', marginTop: 2 }}>{load_score} / {MAX_SCORE} max</div>
      </div>

      {/* Initiatives */}
      <div className="pf-person-row__inits">
        {initiatives.map(k => (
          <span key={k} className="pf-project-tag">{k}</span>
        ))}
      </div>
    </div>
  )
}

// ── Capacity Insights ─────────────────────────────────────────────────────────

function CapacityInsights({ resources }) {
  const sorted = [...resources].sort((a, b) => b.load_score - a.load_score)
  const highest = sorted[0]
  const lowest  = sorted[sorted.length - 1]
  const mostSpread = [...resources].sort((a, b) => b.initiatives.length - a.initiatives.length)[0]

  const cards = []

  if (highest && highest.load_level === 'high') {
    const totalEpics = highest.epics_owned.length + highest.epics_contributing.length
    cards.push({
      type: 'danger',
      title: 'Bottleneck Risk',
      person: highest.name,
      body: `Owns ${highest.epics_owned.length} epic${highest.epics_owned.length !== 1 ? 's' : ''} and has ${highest.stories_open} open tasks across ${totalEpics} epic${totalEpics !== 1 ? 's' : ''}. Single point of failure if blocked.`,
      score: highest.load_score,
    })
  }

  if (mostSpread && mostSpread.initiatives.length > 1) {
    cards.push({
      type: 'warn',
      title: 'Spread Across Initiatives',
      person: mostSpread.name,
      body: `Working across ${mostSpread.initiatives.length} initiatives (${mostSpread.initiatives.join(', ')}). Context switching may slow delivery.`,
      score: mostSpread.load_score,
    })
  }

  if (lowest && lowest.load_level === 'low' && lowest.stories_open < 5) {
    cards.push({
      type: 'good',
      title: 'Available Capacity',
      person: lowest.name,
      body: `Only ${lowest.stories_open} open tasks and ${lowest.epics_owned.length} owned epic${lowest.epics_owned.length !== 1 ? 's' : ''}. Could absorb work from overloaded team members.`,
      score: lowest.load_score,
    })
  }

  if (!cards.length) return null

  const style = {
    danger: { border: '#FF8F73', bg: '#FFF8F6', top: '#DE350B', label: 'BOTTLENECK' },
    warn:   { border: '#FFE380', bg: '#FFFDF5', top: '#FF8B00', label: 'SPREAD RISK' },
    good:   { border: '#ABF5D1', bg: '#F6FFFA', top: '#36B37E', label: 'CAPACITY' },
  }

  return (
    <div className="pf-panel" style={{ marginTop: 16 }}>
      <div className="pf-panel__title">Capacity Insights</div>
      <div className="pf-panel__sub">Auto-detected patterns from resource load data</div>
      <div className="pf-insight-row">
        {cards.map((c, idx) => {
          const s = style[c.type]
          return (
            <div key={idx} className="pf-insight-card" style={{ borderColor: s.border, background: s.bg, borderTopColor: s.top }}>
              <div className="pf-insight-card__label" style={{ color: s.top }}>{s.label}</div>
              <div className="pf-insight-card__title">{c.title}</div>
              <div className="pf-insight-card__person">{c.person}</div>
              <div className="pf-insight-card__body">{c.body}</div>
              <div className="pf-insight-card__score">
                <div className="progress-bar" style={{ height: 4, marginTop: 8 }}>
                  <div className="progress-bar__fill" style={{ width: `${Math.min(c.score / 40 * 100, 100)}%`, background: s.top }} />
                </div>
                <span style={{ fontSize: 10, color: '#97A0AF' }}>Load score {c.score}/40</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Resources Tab ─────────────────────────────────────────────────────────────

function ResourcesTab({ data }) {
  const { resources, unassigned_epics } = data
  return (
    <div id="resources">
      <div className="pf-resource-col-headers">
        <span style={{ flex: '0 0 160px' }}>Person</span>
        <span style={{ flex: 1 }}>Epics (owner / contrib)</span>
        <span style={{ flex: '0 0 160px' }}>Stories / Subtasks</span>
        <span style={{ flex: '0 0 60px' }}>Open</span>
        <span style={{ flex: '0 0 140px' }}>Load Score</span>
        <span style={{ flex: '0 0 80px' }}>Initiatives</span>
      </div>

      {resources.length === 0 && (
        <div className="pf-empty">No resource data. Run a sync to pull assignee information from Jira.</div>
      )}

      {resources.map(r => <PersonRow key={r.name} resource={r} />)}

      {unassigned_epics.length > 0 && (
        <div className="pf-unassigned-row">
          <div className="pf-unassigned-row__label">
            <span style={{ fontWeight: 600, color: '#97A0AF' }}>Unassigned</span>
            <span style={{ fontSize: 11, color: '#97A0AF', marginLeft: 8 }}>
              {unassigned_epics.length} epic{unassigned_epics.length !== 1 ? 's' : ''} with no owner in Jira
            </span>
          </div>
          <div className="pf-unassigned-row__epics">
            {unassigned_epics.map(e => {
              const hc = HEALTH_COLOR[e.health] || HEALTH_COLOR['N/A']
              return (
                <span key={e.key} className="pf-epic-tag" style={{ borderColor: hc.bar, background: hc.bg, color: hc.text }}>
                  <span className="pf-epic-tag__key">{e.key}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      <CapacityInsights resources={resources} />
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const navigate = useNavigate()
  const { pis, loading: pisLoading } = usePIs()
  const { projects, loading: projLoading } = useProjects()

  const defaultPi = pis.find(isActivePi) || pis[0]
  const [selectedPi, setSelectedPi]       = useState(null)
  const [selectedProject, setSelectedProject] = useState('ALL')
  const [includeDone, setIncludeDone]     = useState(false)
  const [activeTab, setActiveTab]         = useState('overview')

  const piId = selectedPi || defaultPi?.id || null
  const { data, loading, error } = usePortfolio(piId, selectedProject, includeDone)

  if (pisLoading || projLoading) return <div className="loading"><div className="spinner" /> Loading...</div>

  if (!pis.length) return (
    <div className="page">
      <div className="empty-state">
        <h3>No PIs configured</h3>
        <p>Go to <a href="/settings">Settings</a> to create Program Increments.</p>
      </div>
    </div>
  )

  const currentPi = pis.find(p => p.id === piId)

  return (
    <div>
      {/* Filter bar */}
      <div className="pf-filter-bar">
        <div className="pf-filter-group">
          <label className="pf-filter-label">PROGRAM INCREMENT</label>
          <select
            className="pf-select"
            value={piId || ''}
            onChange={e => setSelectedPi(e.target.value)}
          >
            {pis.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}{isActivePi(p) ? ' ● Active' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="pf-filter-group">
          <label className="pf-filter-label">PROJECT</label>
          <select
            className="pf-select"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
          </select>
        </div>

        <div className="pf-filter-group">
          <label className="pf-filter-label">SHOW DONE</label>
          <button
            className={`toggle-btn${includeDone ? ' toggle-btn--active' : ''}`}
            onClick={() => setIncludeDone(v => !v)}
          >
            {includeDone ? 'On' : 'Off'}
          </button>
        </div>

        {currentPi && (
          <div className="pf-filter-meta">
            {isActivePi(currentPi) && <span className="pf-active-badge">ACTIVE</span>}
            <span>{fmtDate(currentPi.start_date)} – {fmtDate(currentPi.end_date)}</span>
            <span>· {totalDays(currentPi)} days total</span>
          </div>
        )}
      </div>

      {/* Sub-tabs */}
      <div className="tabs">
        <button
          className={`tab${activeTab === 'overview' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab${activeTab === 'resources' ? ' tab--active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          Resources
          {data?.resources?.filter(r => r.load_level === 'high').length > 0 && (
            <span className="pf-alert-dot" />
          )}
        </button>
      </div>

      <div className="page">
        <div className="pf-page-header">
          <h1 className="pf-page-title">Portfolio</h1>
          <p className="pf-page-sub">
            {currentPi?.name} · {selectedProject === 'ALL' ? 'All Projects' : projects.find(p => p.key === selectedProject)?.name || selectedProject}
          </p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {!piId && (
          <div className="pf-empty">Select a PI above to view portfolio data.</div>
        )}

        {loading && (
          <div className="loading"><div className="spinner" /> Building portfolio...</div>
        )}

        {!loading && data && activeTab === 'overview' && (
          <OverviewTab data={data} navigate={navigate} />
        )}

        {!loading && data && activeTab === 'resources' && (
          <ResourcesTab data={data} />
        )}
      </div>
    </div>
  )
}
