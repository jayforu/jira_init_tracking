import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <nav className="nav">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="nav__title">Initiative Tracker</span>
      </Link>
      <span className="nav__instance">{import.meta.env.VITE_JIRA_HOST || 'Jira Cloud'}</span>
      <div className="nav__links">
        <Link to="/" className={`nav__link ${pathname === '/' ? 'nav__link--active' : ''}`}>
          Initiatives
        </Link>
        <Link to="/pi" className={`nav__link ${pathname === '/pi' ? 'nav__link--active' : ''}`}>
          PI Board
        </Link>
        <Link to="/executive" className={`nav__link ${pathname === '/executive' ? 'nav__link--active' : ''}`}>
          Executive View
        </Link>
      </div>
      <Link to="/settings">
        <button className="nav__settings">⚙ Settings</button>
      </Link>
    </nav>
  )
}
