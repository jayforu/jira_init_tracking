import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'
import InitiativeListPage from './pages/InitiativeListPage'
import InitiativeDetailPage from './pages/InitiativeDetailPage'
import Nav from './components/Nav'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<InitiativeListPage />} />
        <Route path="/initiative/:key" element={<InitiativeDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
