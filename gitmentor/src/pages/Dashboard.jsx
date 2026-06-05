import React, { useState, useEffect } from 'react'

const BADGES = [
  { id: 'first_commit', icon: '🌱', label: 'First Commit', desc: 'Made your first Git commit', xp: 50, unlocked: true },
  { id: 'brancher', icon: '⎇', label: 'Brancher', desc: 'Created and switched branches', xp: 100, unlocked: true },
  { id: 'merger', icon: '🔀', label: 'Merger', desc: 'Merged a branch successfully', xp: 150, unlocked: true },
  { id: 'conflict_resolver', icon: '⚔️', label: 'Conflict Resolver', desc: 'Resolved your first merge conflict', xp: 200, unlocked: false },
  { id: 'code_reviewer', icon: '◈', label: 'Code Critic', desc: 'Used AI to review 3 commits', xp: 200, unlocked: false },
  { id: 'ci_hero', icon: '🚀', label: 'CI Hero', desc: 'Set up a GitHub Actions workflow', xp: 300, unlocked: false },
  { id: 'pr_master', icon: '📬', label: 'PR Master', desc: 'Opened and merged a Pull Request', xp: 250, unlocked: false },
  { id: 'git_guru', icon: '🏆', label: 'Git Guru', desc: 'Complete all milestones', xp: 500, unlocked: false },
]

const SKILLS = [
  { label: 'Git Basics', progress: 75, color: 'var(--accent-green)' },
  { label: 'Branching', progress: 60, color: 'var(--accent-blue)' },
  { label: 'Merging', progress: 40, color: 'var(--accent-purple)' },
  { label: 'CI/CD', progress: 15, color: 'var(--accent-amber)' },
  { label: 'Collaboration', progress: 30, color: 'var(--accent-red)' },
]

const ACTIVITIES = [
  { time: '2m ago', msg: 'Reviewed commit: "fix: navbar overflow"', type: 'review' },
  { time: '18m ago', msg: 'Solved merge conflict in feature/login', type: 'conflict' },
  { time: '1h ago', msg: 'Visualized branch tree — 4 branches', type: 'visual' },
  { time: '3h ago', msg: 'Badge unlocked: Brancher ⎇', type: 'badge' },
]

const typeColor = { review: 'var(--accent-blue)', conflict: 'var(--accent-red)', visual: 'var(--accent-purple)', badge: 'var(--accent-green)' }

export default function Dashboard() {
  const [xp] = useState(300)
  const maxXp = 500
  const level = 3
  const unlockedCount = BADGES.filter(b => b.unlocked).length

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', animation: 'fadeUp 0.4s ease' }}>
        <p style={{ color: 'var(--accent-green)', fontSize: '13px', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
          $ whoami
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          Your Progress
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          Track your Git mastery journey — earn badges, level up, ship better code.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
        {[
          { label: 'Current Level', value: `Lv. ${level}`, accent: 'var(--accent-green)' },
          { label: 'Total XP', value: `${xp} XP`, accent: 'var(--accent-blue)' },
          { label: 'Badges Earned', value: `${unlockedCount}/${BADGES.length}`, accent: 'var(--accent-purple)' },
          { label: 'Commits Reviewed', value: '7', accent: 'var(--accent-amber)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
          }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 700, color: stat.accent, fontFamily: 'var(--font-display)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* XP Bar */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem',
        animation: 'fadeUp 0.4s ease 0.2s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Level {level} → Level {level + 1}</span>
          <span style={{ fontSize: '13px', color: 'var(--accent-green)' }}>{xp} / {maxXp} XP</span>
        </div>
        <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${(xp / maxXp) * 100}%`,
            background: 'linear-gradient(90deg, var(--accent-green), var(--accent-blue))',
            borderRadius: '4px', transition: 'width 1s ease',
          }} />
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>{maxXp - xp} XP to next level</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Skill Bars */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '1.5rem',
          animation: 'fadeUp 0.4s ease 0.25s both',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Skill Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {SKILLS.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{skill.label}</span>
                  <span style={{ fontSize: '13px', color: skill.color }}>{skill.progress}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${skill.progress}%`,
                    background: skill.color, borderRadius: '3px',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '1.5rem',
          animation: 'fadeUp 0.4s ease 0.3s both',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ACTIVITIES.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: typeColor[act.type], flexShrink: 0, marginTop: '5px',
                }} />
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{act.msg}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.5rem',
        animation: 'fadeUp 0.4s ease 0.35s both',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Achievement Badges
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {BADGES.map((badge, i) => (
            <div key={badge.id} style={{
              background: badge.unlocked ? 'rgba(0,255,136,0.05)' : 'var(--bg-secondary)',
              border: `1px solid ${badge.unlocked ? 'rgba(0,255,136,0.2)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '1rem',
              opacity: badge.unlocked ? 1 : 0.45,
              transition: 'all 0.2s ease',
              cursor: badge.unlocked ? 'default' : 'not-allowed',
              animation: `fadeUp 0.4s ease ${0.4 + i * 0.05}s both`,
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{badge.unlocked ? badge.icon : '🔒'}</div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: badge.unlocked ? 'var(--accent-green)' : 'var(--text-muted)', marginBottom: '4px' }}>
                {badge.label}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{badge.desc}</p>
              <p style={{ fontSize: '11px', color: badge.unlocked ? 'var(--accent-amber)' : 'var(--text-muted)', marginTop: '6px' }}>+{badge.xp} XP</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
