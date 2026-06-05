import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '~/dashboard', icon: '⬡' },
  { path: '/visualizer', label: '~/visualizer', icon: '⎇' },
  { path: '/reviewer', label: '~/ai-review', icon: '◈' },
  { path: '/playground', label: '~/playground', icon: '⚡' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10, 14, 19, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      height: '64px',
      display: 'flex', alignItems: 'center',
      padding: '0 2rem',
      justifyContent: 'space-between',
    }}>
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--accent-green)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0a0e13', fontWeight: 700, fontSize: '16px',
            fontFamily: 'var(--font-display)',
          }}>G</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
          }}>GitMentor</span>
          <span style={{
            fontSize: '10px',
            color: 'var(--accent-green)',
            background: 'rgba(0,255,136,0.1)',
            padding: '2px 8px',
            borderRadius: '100px',
            border: '1px solid rgba(0,255,136,0.2)',
          }}>v1.0</span>
        </div>
      </NavLink>

      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(0,255,136,0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', gap: '6px',
            })}
          >
            <span>{item.icon}</span>
            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
