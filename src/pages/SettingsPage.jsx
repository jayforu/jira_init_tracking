import React, { useState } from 'react'
import useProjects from '../hooks/useProjects'

export default function SettingsPage() {
  const { projects, loading, addProject, removeProject } = useProjects()
  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!key.trim() || !name.trim()) return
    setSubmitting(true)
    setStatus({ type: 'validating', msg: `Validating project "${key.toUpperCase()}"...` })
    try {
      await addProject(key.trim(), name.trim())
      setStatus({ type: 'success', msg: `Project "${key.toUpperCase()}" added.` })
      setKey('')
      setName('')
    } catch (e) {
      setStatus({ type: 'error', msg: e.response?.data?.error || e.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async (projectKey) => {
    if (!confirm(`Remove project "${projectKey}"? This will also remove its pinned initiatives.`)) return
    await removeProject(projectKey)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Tracked Projects</h1>
          <span className="page-header__sub">Add Jira projects to monitor their initiatives</span>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleAdd}>
        <div className="form-field">
          <label>Project Key</label>
          <input value={key} onChange={e => setKey(e.target.value)} placeholder="e.g. SCHED" />
        </div>
        <div className="form-field">
          <label>Display Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Scheduling" />
        </div>
        <button type="submit" className="btn btn--primary" disabled={submitting} style={{ alignSelf: 'flex-end', padding: '8px 18px' }}>
          {submitting ? '...' : '+ Add'}
        </button>
      </form>

      {status && (
        <div className={`error-msg`} style={{
          background: status.type === 'error' ? '#FFEBE6' : status.type === 'success' ? '#E3FCEF' : '#FFFAE6',
          borderColor: status.type === 'error' ? '#FF5630' : status.type === 'success' ? '#36B37E' : '#FF991F',
          color: status.type === 'error' ? '#BF2600' : status.type === 'success' ? '#006644' : '#974F0C'
        }}>
          {status.msg}
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>Project Key</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#6B778C' }}>
                  No projects configured yet. Add one above.
                </td>
              </tr>
            )}
            {projects.map(p => (
              <tr key={p.key}>
                <td style={{ padding: '12px' }}><strong>{p.name}</strong></td>
                <td style={{ padding: '12px', color: '#6B778C' }}>{p.key}</td>
                <td style={{ padding: '12px' }}>
                  <span className="status-badge status-badge--connected">Connected</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="btn btn--danger btn--sm" onClick={() => handleRemove(p.key)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
