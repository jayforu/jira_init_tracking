import React from 'react'

const MAP = {
  Good: 'good', Done: 'done', 'At Risk': 'atrisk', Blocked: 'blocked', 'N/A': 'na'
}

export default function HealthChip({ health }) {
  return <span className={`chip chip--${MAP[health] || 'na'}`}>{health || 'N/A'}</span>
}
