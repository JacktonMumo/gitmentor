import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import GitVisualizer from './pages/GitVisualizer'
import AIReviewer from './pages/AIReviewer'
import MergePlayground from './pages/MergePlayground'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '64px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visualizer" element={<GitVisualizer />} />
          <Route path="/reviewer" element={<AIReviewer />} />
          <Route path="/playground" element={<MergePlayground />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
