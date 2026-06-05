import React, { useState } from 'react'

const CHALLENGES = [
  {
    id: 1,
    title: 'The Simple Greeting',
    difficulty: 'Beginner',
    desc: 'Two developers edited the same greeting function. Resolve the conflict.',
    conflicted: `function greetUser(name) {
<<<<<<< HEAD (main branch)
  return "Hello, " + name + "! Welcome back.";
=======
  return \`Hi \${name}! Good to see you again.\`;
>>>>>>> feature/modern-greeting
}`,
    solutions: [
      `function greetUser(name) {\n  return \`Hello, \${name}! Welcome back.\`;\n}`,
      `function greetUser(name) {\n  return \`Hi \${name}! Welcome back.\`;\n}`,
    ],
    hint: 'Keep the modern template literal syntax from feature branch, but the original message tone from main.',
    xp: 50,
  },
  {
    id: 2,
    title: 'Config Conflict',
    difficulty: 'Intermediate',
    desc: 'Two teammates changed the app config at the same time.',
    conflicted: `const config = {
  appName: "GitMentor",
<<<<<<< HEAD
  version: "1.0.0",
  debug: false,
  port: 3000,
=======
  version: "1.1.0",
  debug: true,
  port: 8080,
  logLevel: "verbose"
>>>>>>> feature/dev-config
};`,
    solutions: [
      `const config = {\n  appName: "GitMentor",\n  version: "1.1.0",\n  debug: false,\n  port: 3000,\n  logLevel: "verbose"\n};`,
    ],
    hint: 'Use the newer version, keep production settings (debug: false, port: 3000), but include the new logLevel field.',
    xp: 100,
  },
  {
    id: 3,
    title: 'Function Evolution',
    difficulty: 'Advanced',
    desc: 'One dev refactored a fetch function while another added error handling.',
    conflicted: `async function getUser(id) {
<<<<<<< HEAD
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error('User not found');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
=======
  const res = await fetch(\`/api/users/\${id}\`);
  const data = await res.json();
  return data?.user ?? null;
>>>>>>> feature/refactor
}`,
    solutions: [
      `async function getUser(id) {\n  try {\n    const res = await fetch(\`/api/users/\${id}\`);\n    if (!res.ok) throw new Error('User not found');\n    const data = await res.json();\n    return data?.user ?? null;\n  } catch (err) {\n    console.error(err);\n    return null;\n  }\n}`,
    ],
    hint: 'Combine both: keep the try/catch error handling from main AND the optional chaining from feature.',
    xp: 150,
  },
]

const diffColor = (line) => {
  if (line.startsWith('<<<<<<<') || line.startsWith('=======') || line.startsWith('>>>>>>>'))
    return { color: '#fbbf24', background: 'rgba(251,191,36,0.08)', fontWeight: 700 }
  if (line.startsWith('-')) return { color: 'var(--accent-red)', background: 'rgba(248,113,113,0.05)' }
  if (line.startsWith('+')) return { color: 'var(--accent-green)', background: 'rgba(0,255,136,0.05)' }
  return { color: 'var(--text-primary)' }
}

export default function MergePlayground() {
  const [activeChallenge, setActiveChallenge] = useState(0)
  const [userCode, setUserCode] = useState(CHALLENGES[0].conflicted)
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState([])

  const challenge = CHALLENGES[activeChallenge]

  const handleChallengeSwitch = (idx) => {
    setActiveChallenge(idx)
    setUserCode(CHALLENGES[idx].conflicted)
    setResult(null)
    setShowHint(false)
  }

  const checkSolution = () => {
    const cleaned = userCode.trim().replace(/\r/g, '')
    const hasConflictMarkers = ['<<<<<<<', '=======', '>>>>>>>'].some(m => cleaned.includes(m))

    if (hasConflictMarkers) {
      setResult({ success: false, msg: 'Conflict markers still present! Remove all <<<<<<, =======, and >>>>>>> lines.' })
      return
    }

    const isCorrect = challenge.solutions.some(sol =>
      cleaned.replace(/\s+/g, ' ').trim() === sol.replace(/\s+/g, ' ').trim()
    )

    if (isCorrect) {
      setResult({ success: true, msg: `Perfect resolution! +${challenge.xp} XP`, xp: challenge.xp })
      if (!solved.includes(challenge.id)) setSolved(prev => [...prev, challenge.id])
    } else if (!hasConflictMarkers) {
      setResult({ success: 'partial', msg: 'No conflict markers — good! But your resolution differs from the expected answer. Check the hint for guidance.' })
    }
  }

  const difficultyColor = { Beginner: 'var(--accent-green)', Intermediate: 'var(--accent-amber)', Advanced: 'var(--accent-red)' }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
        <p style={{ color: 'var(--accent-red)', fontSize: '13px', marginBottom: '6px' }}>$ git merge feature/branch — CONFLICT</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>
          Merge Playground
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          Practice resolving real merge conflicts in a safe environment.
        </p>
      </div>

      {/* Challenge selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', animation: 'fadeUp 0.4s ease 0.1s both' }}>
        {CHALLENGES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => handleChallengeSwitch(i)}
            style={{
              flex: 1, padding: '14px', borderRadius: 'var(--radius)',
              background: activeChallenge === i ? 'var(--bg-card)' : 'var(--bg-secondary)',
              border: `1px solid ${activeChallenge === i ? 'var(--border-bright)' : 'var(--border)'}`,
              color: 'var(--text-primary)', textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{c.title}</span>
              {solved.includes(c.id) && <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>✓ Solved</span>}
            </div>
            <span style={{ fontSize: '11px', color: difficultyColor[c.difficulty] }}>⬡ {c.difficulty}</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-amber)', marginLeft: '12px' }}>+{c.xp} XP</span>
          </button>
        ))}
      </div>

      {/* Main area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Left: conflict view */}
        <div style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '12px',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Conflict File</span>
              <span style={{ fontSize: '11px', color: difficultyColor[challenge.difficulty] }}>⬡ {challenge.difficulty}</span>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)' }}>
              {challenge.conflicted.split('\n').map((line, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', padding: '1px 4px',
                  borderRadius: '2px', ...diffColor(line),
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', minWidth: '20px', userSelect: 'none' }}>{i + 1}</span>
                  <code style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{line}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge description */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '14px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '10px' }}>
              {challenge.desc}
            </p>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                fontSize: '12px', color: 'var(--accent-amber)',
                background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                padding: '6px 12px', borderRadius: 'var(--radius)',
              }}
            >
              {showHint ? '▲ Hide hint' : '💡 Show hint'}
            </button>
            {showHint && (
              <p style={{ fontSize: '12px', color: 'var(--accent-amber)', marginTop: '10px', lineHeight: 1.5 }}>
                {challenge.hint}
              </p>
            )}
          </div>
        </div>

        {/* Right: editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.4s ease 0.2s both' }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden', flex: 1,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Resolution</span>
            </div>
            <textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              rows={16}
              style={{
                width: '100%', padding: '12px 16px', resize: 'none',
                fontSize: '12px', lineHeight: '1.7', borderRadius: '0',
                background: 'var(--bg-secondary)', border: 'none',
                color: 'var(--accent-green)', fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          <button
            onClick={checkSolution}
            style={{
              padding: '14px', background: 'var(--accent-green)', color: '#0a0e13',
              borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: 700,
              fontFamily: 'var(--font-display)', border: 'none',
            }}
          >
            ⚡ Check Resolution
          </button>

          <button
            onClick={() => { setUserCode(challenge.conflicted); setResult(null); setShowHint(false) }}
            style={{
              padding: '10px', background: 'transparent', color: 'var(--text-muted)',
              borderRadius: 'var(--radius)', fontSize: '13px',
              border: '1px solid var(--border)',
            }}
          >
            ↺ Reset Challenge
          </button>

          {result && (
            <div style={{
              padding: '14px', borderRadius: 'var(--radius)',
              background: result.success === true ? 'rgba(0,255,136,0.08)' : result.success === 'partial' ? 'rgba(251,191,36,0.08)' : 'rgba(248,113,113,0.08)',
              border: `1px solid ${result.success === true ? 'rgba(0,255,136,0.3)' : result.success === 'partial' ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)'}`,
            }}>
              <p style={{
                fontSize: '13px', lineHeight: 1.5,
                color: result.success === true ? 'var(--accent-green)' : result.success === 'partial' ? 'var(--accent-amber)' : 'var(--accent-red)',
              }}>
                {result.success === true ? '✓ ' : result.success === 'partial' ? '◎ ' : '✗ '}
                {result.msg}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
