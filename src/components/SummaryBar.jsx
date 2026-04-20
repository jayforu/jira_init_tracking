import React from 'react'

export default function SummaryBar({ label, stats }) {
  return (
    <div className="summary-bar">
      <span className="summary-bar__label">{label}</span>
      {stats.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="summary-bar__divider" />}
          <div className="summary-bar__stat">
            <span className={`summary-bar__val${s.color ? ` summary-bar__val--${s.color}` : ''}`}>{s.value}</span>
            <span className="summary-bar__key">{s.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
