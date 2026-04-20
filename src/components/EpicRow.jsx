import React from 'react'
import ProgressBar from './ProgressBar'
import HealthChip from './HealthChip'

const ACCENT = { Good: '#36B37E', Done: '#36B37E', 'At Risk': '#FF991F', Blocked: '#FF5630', 'N/A': '#DFE1E6' }

export default function EpicRow({ epic, jiraHost }) {
  const { key, summary, status, assignee, subtasks, tests, health, team } = epic
  const epicUrl = `https://${jiraHost}/browse/${key}`

  return (
    <tr className="epic-row">
      <td>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ width: 4, minHeight: 44, borderRadius: 2, background: ACCENT[health] || '#DFE1E6', flexShrink: 0 }} />
          <div>
            <div className="epic-row__name">
              <a href={epicUrl} target="_blank" rel="noreferrer">{summary}</a>
            </div>
            <div className="epic-row__key">{key}</div>
            {team && <div className="epic-row__team">{team}</div>}
          </div>
        </div>
      </td>
      <td>
        <span style={{
          display: 'inline-block', padding: '3px 10px', borderRadius: 12,
          fontSize: 11, fontWeight: 600,
          background: status === 'Done' ? '#E3FCEF' : '#DEEBFF',
          color: status === 'Done' ? '#006644' : '#0052CC'
        }}>
          {status || '—'}
        </span>
      </td>
      <td style={{ minWidth: 120 }}>
        <ProgressBar value={subtasks?.done || 0} max={subtasks?.total || 0} />
      </td>
      <td style={{ minWidth: 120 }}>
        <ProgressBar value={tests?.pass || 0} max={tests?.total || 0} />
        <span style={{ fontSize: 10, color: '#6B778C' }}>{tests?.total || 0} cases</span>
      </td>
      <td>
        {tests?.total > 0 ? (
          <div className="test-pills">
            {tests.pass > 0  && <span className="pill pill--pass">{tests.pass} ✓</span>}
            {tests.fail > 0  && <span className="pill pill--fail">{tests.fail} ✗</span>}
            {tests.wip > 0   && <span className="pill pill--wip">{tests.wip} WIP</span>}
            {tests.notrun > 0 && <span className="pill pill--notrun">{tests.notrun} TODO</span>}
          </div>
        ) : (
          <span style={{ color: '#6B778C', fontSize: 12 }}>No tests</span>
        )}
      </td>
      <td><HealthChip health={health} /></td>
    </tr>
  )
}
