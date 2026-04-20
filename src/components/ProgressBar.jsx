import React from 'react'

const COLOR = (pct) => pct >= 90 ? '#36B37E' : pct >= 50 ? '#FF991F' : '#FF5630'

export default function ProgressBar({ value, max, showLabel = true }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${pct}%`, background: COLOR(pct) }} />
      </div>
      {showLabel && <span style={{ fontSize: 10, color: '#6B778C' }}>{value}/{max}</span>}
    </div>
  )
}
