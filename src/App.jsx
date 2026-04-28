import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'
import InitiativeListPage from './pages/InitiativeListPage'
import InitiativeDetailPage from './pages/InitiativeDetailPage'
import ExecutiveDashboardPage from './pages/ExecutiveDashboardPage'
import PIBoardPage from './pages/PIBoardPage'
import PortfolioPage from './pages/PortfolioPage'
import TeamActivityPage from './pages/TeamActivityPage'
import Nav from './components/Nav'
import AuthGuard from './components/AuthGuard'

export default function App() {
  return (
    <>
      <Nav />
      <AuthGuard>
        <Routes>
          <Route path="/" element={<InitiativeListPage />} />
          <Route path="/initiative/:key" element={<InitiativeDetailPage />} />
          <Route path="/executive" element={<ExecutiveDashboardPage />} />
          <Route path="/pi" element={<PIBoardPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/team-activity" element={<TeamActivityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGuard>
    </>
  )
}
