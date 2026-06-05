import React, { useState } from 'react'

const INITIAL_GRAPH = {
  commits: [
    { id: 'c1', msg: 'Initial commit', branch: 'main', x: 80, y: 200, parents: [] },
    { id: 'c2', msg: 'Add README', branch: 'main', x: 200, y: 200, parents: ['c1'] },
    { id: 'c3', msg: 'feat: create feature branch', branch: 'feature', x: 320, y: 120, parents: ['c2'] },
    { id: 'c4', msg: 'fix: hotfix on main', branch: 'main', x: 320, y: 200, parents: ['c2'] },
    { id: 'c5', msg: 'feat: add login component', branch: 'feature', x: 440, y: 120, parents: ['c3'] },
    { id: 'c6', msg: 'feat: add tests', branch: 'feature', x: 560, y: 120, parents: ['c5'] },
    { id: 'c7', msg: 'Merge feature into main', branch: 'main', x: 680, y: 200, parents: ['c4', 'c6'] },
  ],
  branches: [
    { name: 'main', color: '#00ff88', headId: 'c7' },
    { name: 'feature', color: '#4f9eff', headId: 'c6' },
  ],
}

const BRANCH_COLORS = { main: '#00ff88', feature: '#4f9eff', develop: '#a78bfa', hotfix: '#f87171' }

export default function GitVisualizer() {
  const [graph, setGraph] = useState(INITIAL_GRAPH)
  const [selected, setSelected] = useState(null)
  const [newMsg, setNewMsg] = useState('')
  const [newBranch, setNewBranch] = useState('')
  const [activeBranch, setActiveBranch] = useState('main')
  const [log, setLog] = useState([
    '$ git init',
    '$ git commit -m "Initial commit"',
    '$ git checkout -b feature',
    '$ git merge feature',
  ])

  const addLog = (cmd) => setLog(prev => [...prev.slice(-8), cmd])

  const getCommitColor = (branch) => BRANCH_COLORS[branch] || '#fbbf24'

  const getBranchY = (branch) => {
    const map = { main: 200, feature: 120, develop: 280, hotfix: 60 }
    return map[branch] || 200
  }

  const handleAddCommit = () => {
    if (!newMsg.trim()) return
    const branch = activeBranch
    const branchCommits = graph.commits.filter(c => c.branch === branch)
    const lastCommit = branchCommits[branchCommits.length - 1]
    const allX = graph.commits.map(c => c.x)
    const maxX = Math.max(...allX)
    const newId = `c${graph.commits.length + 1}`
    const newCommit = {
      id: newId,
      msg: newMsg,
      branch,
      x: maxX + 120,
      y: getBranchY(branch),
      parents: lastCommit ? [lastCommit.id] : [],
    }
    setGraph(prev => ({
      ...prev,
      commits: [...prev.commits, newCommit],
      branches: prev.branches.map(b => b.name === branch ? { ...b, headId: newId } : b),
    }))
    addLog(`$ git commit -m "${newMsg}"`)
    setNewMsg('')
  }

  const handleAddBranch = () => {
    if (!newBranch.trim() || graph.branches.find(b => b.name === newBranch)) return
    const color = ['#a78bfa', '#fbbf24', '#f87171', '#fb923c'][graph.branches.length % 4]
    setGraph(prev => ({
      ...prev,
      branches: [...prev.branches, { name: newBranch, color, headId: prev.commits[prev.commits.length - 1]?.id }],
    }))
    addLog(`$ git checkout -b ${newBranch}`)
    setActiveBranch(newBranch)
    setNewBranch('')
  }

  const svgWidth = Math.max(800, Math.max(...graph.commits.map(c => c.x)) + 120)

  const getCommitById = (id) => graph.commits.find(c => c.id === id)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
        <p style={{ color: 'var(--accent-blue)', fontSize: '13px', marginBottom: '6px' }}>$ git log --graph</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>
          Git Visualizer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          Watch commits, branches, and merges come to life in real-time.
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
        marginBottom: '1.5rem', animation: 'fadeUp 0.4s ease 0.1s both',
      }}>
        {/* Active branch selector */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Branch</p>
          <select
            value={activeBranch}
            onChange={e => setActiveBranch(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: 'var(--radius)' }}
          >
            {graph.branches.map(b => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Add commit */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Commit Message</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCommit()}
              placeholder="feat: add feature..."
              style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: 'var(--radius)' }}
            />
            <button onClick={handleAddCommit} style={{
              background: 'var(--accent-green)', color: '#0a0e13',
              padding: '8px 14px', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: 700,
            }}>+</button>
          </div>
        </div>

        {/* New branch */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>New Branch</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={newBranch}
              onChange={e => setNewBranch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddBranch()}
              placeholder="branch-name..."
              style={{ flex: 1, padding: '8px', fontSize: '12px', borderRadius: 'var(--radius)' }}
            />
            <button onClick={handleAddBranch} style={{
              background: 'var(--accent-blue)', color: '#0a0e13',
              padding: '8px 14px', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: 700,
            }}>⎇</button>
          </div>
        </div>
      </div>

      {/* SVG Graph */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.5rem',
        animation: 'fadeUp 0.4s ease 0.15s both',
      }}>
        {/* Branch legend */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Branches:</span>
          {graph.branches.map(b => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color }} />
              <span style={{ fontSize: '12px', color: b.color }}>{b.name}</span>
            </div>
          ))}
        </div>

        <div style={{ overflowX: 'auto', padding: '20px 0' }}>
          <svg width={svgWidth} height={320} style={{ display: 'block', minWidth: '100%' }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--border-bright)" />
              </marker>
            </defs>

            {/* Grid lines */}
            {[60, 120, 180, 240, 300].map(y => (
              <line key={y} x1="0" y1={y} x2={svgWidth} y2={y}
                stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4,8" />
            ))}

            {/* Edges */}
            {graph.commits.map(commit =>
              commit.parents.map(parentId => {
                const parent = getCommitById(parentId)
                if (!parent) return null
                const color = getCommitColor(commit.branch)
                const isMerge = commit.parents.length > 1
                return (
                  <path
                    key={`${parentId}-${commit.id}`}
                    d={commit.y === parent.y
                      ? `M ${parent.x} ${parent.y} L ${commit.x} ${commit.y}`
                      : `M ${parent.x} ${parent.y} C ${parent.x + 60} ${parent.y} ${commit.x - 60} ${commit.y} ${commit.x} ${commit.y}`
                    }
                    stroke={isMerge ? '#a78bfa' : color}
                    strokeWidth={isMerge ? 2 : 1.5}
                    fill="none"
                    strokeDasharray={isMerge ? '6,3' : 'none'}
                    opacity={0.7}
                    markerEnd="url(#arrowhead)"
                  />
                )
              })
            )}

            {/* Commits */}
            {graph.commits.map(commit => {
              const color = getCommitColor(commit.branch)
              const isSelected = selected?.id === commit.id
              const isMerge = commit.parents.length > 1
              return (
                <g key={commit.id} onClick={() => setSelected(commit)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={commit.x} cy={commit.y}
                    r={isSelected ? 16 : 12}
                    fill={isMerge ? '#a78bfa' : color}
                    opacity={isSelected ? 1 : 0.85}
                    stroke={isSelected ? '#fff' : 'transparent'}
                    strokeWidth={2}
                  />
                  {isMerge && (
                    <circle cx={commit.x} cy={commit.y} r={6}
                      fill="none" stroke="#0a0e13" strokeWidth={2} />
                  )}
                  <text
                    x={commit.x} y={commit.y + 28}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {commit.id}
                  </text>
                </g>
              )
            })}

            {/* Branch labels */}
            {graph.branches.map(branch => {
              const head = getCommitById(branch.headId)
              if (!head) return null
              return (
                <g key={branch.name}>
                  <rect
                    x={head.x - 30} y={head.y - 40}
                    width={60} height={20} rx={4}
                    fill={branch.color} opacity={0.15}
                  />
                  <rect
                    x={head.x - 30} y={head.y - 40}
                    width={60} height={20} rx={4}
                    fill="none" stroke={branch.color} strokeWidth={1} opacity={0.5}
                  />
                  <text
                    x={head.x} y={head.y - 26}
                    textAnchor="middle"
                    fill={branch.color}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                  >
                    {branch.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Selected commit details */}
        {selected && (
          <div style={{
            padding: '16px 20px', borderTop: '1px solid var(--border)',
            background: 'rgba(79,158,255,0.05)',
          }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>COMMIT</p>
                <p style={{ fontSize: '13px', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{selected.id}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>MESSAGE</p>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selected.msg}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>BRANCH</p>
                <p style={{ fontSize: '13px', color: getCommitColor(selected.branch) }}>{selected.branch}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>PARENTS</p>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.parents.join(', ') || 'none'}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{
                marginLeft: 'auto', padding: '6px 12px', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                color: 'var(--text-muted)', fontSize: '12px',
              }}>✕ close</button>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Log */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem',
        animation: 'fadeUp 0.4s ease 0.2s both',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminal Log</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {log.map((line, i) => (
            <p key={i} style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
              {line}
            </p>
          ))}
          <p style={{ fontSize: '13px', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
            $ <span className="blink">▋</span>
          </p>
        </div>
      </div>
    </div>
  )
}
