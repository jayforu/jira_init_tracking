import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav__title">Initiative Tracker</span>
      <span className="nav__instance">{import.meta.env.VITE_JIRA_HOST || 'Jira Cloud'}</span>
      <Link to="/settings">
        <button className="nav__settings">⚙ Settings</button>
      </Link>
    </nav>
  )
}
