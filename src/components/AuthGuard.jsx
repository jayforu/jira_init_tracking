import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    axios.get('/auth/status').then(r => setStatus(r.data)).catch(() => setStatus({ connected: false }))
  }, [])

  if (!status) return <div className="loading"><div className="spinner" /> Checking Jira connection...</div>

  if (!status.connected) return (
    <div className="empty-state">
      <h3>Not connected to Jira</h3>
      <p style={{ marginBottom: 16 }}>You need to authorise this app with your Atlassian account.</p>
      <a href="http://localhost:3001/auth/login" target="_blank" rel="noreferrer">
        <button className="btn btn--primary" style={{ padding: '10px 24px', fontSize: 14 }}>
          Connect to Jira →
        </button>
      </a>
    </div>
  )

  return children
}
