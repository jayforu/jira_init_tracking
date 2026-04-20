import React from 'react'
import EpicRow from './EpicRow'

export default function EpicTable({ epics, jiraHost, loading }) {
  if (loading) return <div className="loading"><div className="spinner" /> Loading epics...</div>

  if (!epics.length) return (
    <div className="empty-state">
      <h3>No epics found</h3>
      <p>This initiative has no epics yet.</p>
    </div>
  )

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Epic</th>
          <th>Dev Status</th>
          <th>Subtasks</th>
          <th>Test Cases</th>
          <th>Pass / Fail</th>
          <th>Health</th>
        </tr>
      </thead>
      <tbody>
        {epics.map(epic => (
          <EpicRow key={epic.key} epic={epic} jiraHost={jiraHost} />
        ))}
      </tbody>
    </table>
  )
}
