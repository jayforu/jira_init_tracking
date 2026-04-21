import React, { useState } from 'react'
import useProjects from '../hooks/useProjects'
import usePIs from '../hooks/usePIs'

export default function SettingsPage() {
  const { projects, loading, addProject, removeProject, updateProject } = useProjects()
  const { pis, loading: pisLoading, createPI, deletePI } = usePIs()
  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [piName, setPiName] = useState('')
  const [piStart, setPiStart] = useState('')
  const [piEnd, setPiEnd] = useState('')
  const [piStatus, setPiStatus] = useState(null)
  const [piSubmitting, setPiSubmitting] = useState(false)

  const handleAddPI = async (e) => {
    e.preventDefault()
    if (!piName.trim() || !piStart || !piEnd) return
    if (new Date(piEnd) <= new Date(piStart)) {
      setPiStatus({ type: 'error', msg: 'End date must be after start date.' })
      return
    }
    setPiSubmitting(true)
    setPiStatus(null)
    try {
      await createPI(piName.trim(), piStart, piEnd)
      setPiStatus({ type: 'success', msg: `PI "${piName.trim()}" created.` })
      setPiName('')
      setPiStart('')
      setPiEnd('')
    } catch (err) {
      setPiStatus({ type: 'error', msg: err.response?.data?.error || err.message })
    } finally {
      setPiSubmitting(false)
    }
  }

  const handleDeletePI = async (id, piNameLabel) => {
    if (!confirm(`Delete PI "${piNameLabel}"? All initiative assignments will be removed.`)) return
    await deletePI(id)
  }

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
              <th>Test Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6B778C' }}>
                  No projects configured yet. Add one above.
                </td>
              </tr>
            )}
            {projects.map(p => {
              const testSource = p.test_source || 'epic'
              return (
                <tr key={p.key}>
                  <td style={{ padding: '12px' }}><strong>{p.name}</strong></td>
                  <td style={{ padding: '12px', color: '#6B778C' }}>{p.key}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 0 }}>
                      {[
                        { value: 'epic',    label: 'Epic' },
                        { value: 'stories', label: 'Stories' },
                        { value: 'both',    label: 'Both' },
                      ].map(({ value, label }, i, arr) => (
                        <button
                          key={value}
                          className={`toggle-btn ${testSource === value ? 'toggle-btn--active' : ''}`}
                          style={{
                            borderRadius: i === 0 ? '4px 0 0 4px' : i === arr.length - 1 ? '0 4px 4px 0' : '0',
                            borderRight: i < arr.length - 1 ? 'none' : undefined,
                            fontSize: 11
                          }}
                          onClick={() => updateProject(p.key, { test_source: value })}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: '#6B778C', marginTop: 4 }}>
                      {testSource === 'stories' ? 'Tests linked to stories under each epic' :
                       testSource === 'both'    ? 'Tests from both epics and their stories (deduplicated)' :
                                                  'Tests linked directly to epics'}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="status-badge status-badge--connected">Connected</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button className="btn btn--danger btn--sm" onClick={() => handleRemove(p.key)}>Remove</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {/* ── Program Increments ── */}
      <div className="page-header" style={{ marginTop: 32 }}>
        <div>
          <h1 className="page-header__title">Program Increments (PIs)</h1>
          <span className="page-header__sub">Define time-boxed delivery windows. Initiatives are assigned to PIs from the PI Board.</span>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleAddPI}>
        <div className="form-field">
          <label>PI Name</label>
          <input value={piName} onChange={e => setPiName(e.target.value)} placeholder="e.g. PI 25.1" />
        </div>
        <div className="form-field">
          <label>Start Date</label>
          <input type="date" value={piStart} onChange={e => setPiStart(e.target.value)} style={{ width: 160 }} />
        </div>
        <div className="form-field">
          <label>End Date</label>
          <input type="date" value={piEnd} onChange={e => setPiEnd(e.target.value)} style={{ width: 160 }} />
        </div>
        <button type="submit" className="btn btn--primary" disabled={piSubmitting} style={{ alignSelf: 'flex-end', padding: '8px 18px' }}>
          {piSubmitting ? '...' : '+ Create PI'}
        </button>
      </form>

      {piStatus && (
        <div className="error-msg" style={{
          background: piStatus.type === 'error' ? '#FFEBE6' : '#E3FCEF',
          borderColor: piStatus.type === 'error' ? '#FF5630' : '#36B37E',
          color: piStatus.type === 'error' ? '#BF2600' : '#006644'
        }}>
          {piStatus.msg}
        </div>
      )}

      {pisLoading ? (
        <div className="loading"><div className="spinner" /> Loading...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>PI Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pis.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6B778C' }}>
                  No PIs created yet. Add one above.
                </td>
              </tr>
            )}
            {pis.map(pi => {
              const weeks = Math.round((new Date(pi.end_date) - new Date(pi.start_date)) / (1000 * 60 * 60 * 24 * 7))
              const progress = piProgress(pi.start_date, pi.end_date)
              const isActive = progress > 0 && progress < 100
              return (
                <tr key={pi.id}>
                  <td style={{ padding: '12px' }}>
                    <strong>{pi.name}</strong>
                    {isActive && <span style={{ marginLeft: 8, fontSize: 10, background: '#E3FCEF', color: '#006644', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>Active</span>}
                  </td>
                  <td style={{ padding: '12px', color: '#42526E', fontSize: 13 }}>{new Date(pi.start_date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#42526E', fontSize: 13 }}>{new Date(pi.end_date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: '#42526E', fontSize: 13 }}>{weeks} weeks</td>
                  <td style={{ padding: '12px' }}>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDeletePI(pi.id, pi.name)}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

function piProgress(startIso, endIso) {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const today = new Date()
  if (today <= start) return 0
  if (today >= end) return 100
  return Math.round(((today - start) / (end - start)) * 100)
}
