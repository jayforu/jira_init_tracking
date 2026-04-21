import React from 'react'
import ProgressBar from './ProgressBar'

const HEALTH_COLOR = { Good: '#36B37E', Done: '#36B37E', 'At Risk': '#FF991F', Blocked: '#FF5630', 'N/A': '#DFE1E6' }

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  const colors = ['#0052CC','#00875A','#6554C0','#FF5630','#FF991F','#00B8D9','#36B37E','#4C9AFF']
  return colors[Math.abs(h) % colors.length]
}

export default function TeamWorkloadPanel({ epics }) {
  // Build person → [{epic, done, total}] using child-item assignees (members),
  // falling back to epic-level assignee when no members data exists.
  const byPerson = {}

  for (const epic of epics) {
    if (epic.members?.length) {
      for (const m of epic.members) {
        if (!byPerson[m.name]) byPerson[m.name] = []
        byPerson[m.name].push({ epic, done: m.done, total: m.total })
      }
    } else if (epic.assignee) {
      // Pre-sync fallback: use epic assignee + subtask totals
      if (!byPerson[epic.assignee]) byPerson[epic.assignee] = []
      byPerson[epic.assignee].push({
        epic,
        done: epic.subtasks?.done || 0,
        total: epic.subtasks?.total || 0
      })
    }
  }

  const people = Object.entries(byPerson).sort((a, b) => {
    const totalA = a[1].reduce((s, e) => s + e.total, 0)
    const totalB = b[1].reduce((s, e) => s + e.total, 0)
    return totalB - totalA
  })

  if (!people.length) return null

  return (
    <div className="team-panel">
      <div className="team-panel__title">Team Workload</div>
      <div className="team-panel__grid">
        {people.map(([name, entries]) => {
          const totalDone = entries.reduce((s, e) => s + e.done, 0)
          const totalTasks = entries.reduce((s, e) => s + e.total, 0)
          const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
          const color = avatarColor(name)
          const pct = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0

          return (
            <div key={name} className="team-card">
              <div className="team-card__header">
                <div className="team-card__avatar" style={{ background: color }}>{initials}</div>
                <div className="team-card__info">
                  <div className="team-card__name">{name}</div>
                  <div className="team-card__meta">
                    {entries.length} epic{entries.length !== 1 ? 's' : ''} · {totalDone}/{totalTasks} tasks
                  </div>
                </div>
                <div className="team-card__pct">{pct}%</div>
              </div>
              <div className="team-card__epics">
                {entries.map(({ epic, done, total }) => (
                  <div key={epic.key} className="team-card__epic-row">
                    <div
                      className="team-card__epic-dot"
                      style={{ background: HEALTH_COLOR[epic.health] || '#DFE1E6' }}
                    />
                    <div className="team-card__epic-name" title={epic.summary}>{epic.summary}</div>
                    <div className="team-card__epic-progress">
                      <ProgressBar value={done} max={total} />
                    </div>
                    <div className="team-card__epic-count">{done}/{total}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
