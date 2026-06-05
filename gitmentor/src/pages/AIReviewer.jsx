import React, { useState } from 'react'

const SAMPLE_CODE = `function fetchUserData(userId) {
  var data = null;
  fetch('/api/users/' + userId)
    .then(function(res) {
      data = res.json();
    })
  console.log(data);
  return data;
}`

const REVIEW_TYPES = [
  { id: 'general', label: 'General Review', icon: '◈' },
  { id: 'git', label: 'Git Best Practices', icon: '⎇' },
  { id: 'security', label: 'Security Audit', icon: '🔒' },
  { id: 'pedagogy', label: 'Learning Feedback', icon: '🎓' },
]

export default function AIReviewer() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [commitMsg, setCommitMsg] = useState('')
  const [reviewType, setReviewType] = useState('general')
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [review, setReview] = useState(null)
  const [error, setError] = useState('')
  const [reviewCount, setReviewCount] = useState(0)

  const buildPrompt = () => {
    const typeInstructions = {
      general: 'Provide a comprehensive code review focusing on code quality, best practices, and improvements.',
      git: 'Review this code from a Git/version control perspective. Comment on commit message quality, code structure for reviewability, and collaboration best practices.',
      security: 'Perform a security-focused code review. Identify vulnerabilities, insecure patterns, and suggest secure alternatives.',
      pedagogy: 'You are a teaching assistant reviewing a student\'s code. Be encouraging but thorough. Explain WHY issues are problems, not just what they are. Use simple language.',
    }

    return `You are GitMentor, an AI code reviewer for student developers learning software engineering best practices.

Review Type: ${reviewType.toUpperCase()}
${typeInstructions[reviewType]}

${commitMsg ? `Commit Message: "${commitMsg}"` : ''}

Code to Review:
\`\`\`
${code}
\`\`\`

Respond ONLY with a JSON object in this exact format (no markdown, no backticks, just raw JSON):
{
  "summary": "One sentence overall assessment",
  "score": <number 1-10>,
  "issues": [
    { "type": "error|warning|suggestion", "line": "<line or 'general'>", "message": "<issue description>", "fix": "<how to fix it>" }
  ],
  "positives": ["<what they did well>"],
  "nextSteps": ["<actionable learning step>"],
  "xpEarned": <number 10-50>
}`
  }

  const handleReview = async () => {
    if (!code.trim()) return
    if (!apiKey.trim()) { setError('Please enter your Gemini API key above.'); return }

    setLoading(true)
    setReview(null)
    setError('')

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt() }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
          }),
        }
      )

      const data = await response.json()

      if (data.error) throw new Error(data.error.message)

      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setReview(parsed)
      setReviewCount(prev => prev + 1)
    } catch (err) {
      setError(`Review failed: ${err.message}. Check your API key and try again.`)
    } finally {
      setLoading(false)
    }
  }

  const issueColor = { error: 'var(--accent-red)', warning: 'var(--accent-amber)', suggestion: 'var(--accent-blue)' }
  const scoreColor = (s) => s >= 8 ? 'var(--accent-green)' : s >= 5 ? 'var(--accent-amber)' : 'var(--accent-red)'

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.4s ease' }}>
        <p style={{ color: 'var(--accent-purple)', fontSize: '13px', marginBottom: '6px' }}>$ git diff HEAD | gemini review</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>
          AI Code Reviewer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
          Paste your code, get constructive AI feedback powered by Gemini.
        </p>
      </div>

      {/* API Key */}
      <div style={{
        background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '1.5rem',
        display: 'flex', gap: '12px', alignItems: 'center',
        animation: 'fadeUp 0.4s ease 0.05s both',
      }}>
        <span style={{ fontSize: '13px', color: 'var(--accent-amber)', whiteSpace: 'nowrap' }}>🔑 API Key:</span>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key..."
          style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: 'var(--radius)', border: '1px solid rgba(251,191,36,0.3)', background: 'var(--bg-secondary)' }}
        />
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
          style={{ fontSize: '12px', color: 'var(--accent-amber)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Get free key →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeUp 0.4s ease 0.1s both' }}>

          {/* Review type */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Review Type</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {REVIEW_TYPES.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => setReviewType(rt.id)}
                  style={{
                    padding: '8px 12px', borderRadius: 'var(--radius)', fontSize: '12px',
                    background: reviewType === rt.id ? 'rgba(167,139,250,0.15)' : 'var(--bg-secondary)',
                    border: `1px solid ${reviewType === rt.id ? 'rgba(167,139,250,0.4)' : 'var(--border)'}`,
                    color: reviewType === rt.id ? 'var(--accent-purple)' : 'var(--text-secondary)',
                    textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span>{rt.icon}</span> {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commit message */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Commit Message (optional)</p>
            <input
              value={commitMsg}
              onChange={e => setCommitMsg(e.target.value)}
              placeholder="feat: add user authentication..."
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', borderRadius: 'var(--radius)' }}
            />
          </div>

          {/* Code input */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', flex: 1 }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Code</p>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={14}
              style={{
                width: '100%', resize: 'vertical', padding: '12px',
                fontSize: '12px', lineHeight: '1.6', borderRadius: 'var(--radius)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                color: 'var(--accent-green)',
              }}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={loading}
            style={{
              padding: '14px', background: loading ? 'var(--bg-secondary)' : 'var(--accent-purple)',
              color: loading ? 'var(--text-muted)' : '#0a0e13',
              borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: 700,
              fontFamily: 'var(--font-display)',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '◈ Analyzing with Gemini...' : '◈ Review My Code'}
          </button>
        </div>

        {/* Right: Review output */}
        <div style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}>
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem',
              fontSize: '13px', color: 'var(--accent-red)',
            }}>⚠ {error}</div>
          )}

          {!review && !loading && !error && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '3rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', minHeight: '400px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>◈</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Paste your code and click Review.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>Gemini will analyze your code and give constructive feedback.</p>
            </div>
          )}

          {loading && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '3rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', minHeight: '400px',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'pulse 1s infinite' }}>◈</div>
              <p style={{ color: 'var(--accent-purple)', fontSize: '14px' }}>Gemini is reviewing your code...</p>
            </div>
          )}

          {review && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Score */}
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '16px',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ textAlign: 'center', minWidth: '60px' }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: scoreColor(review.score), fontFamily: 'var(--font-display)' }}>
                    {review.score}/10
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Score</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{review.summary}</p>
                  <p style={{ fontSize: '12px', color: 'var(--accent-amber)', marginTop: '6px' }}>+{review.xpEarned} XP earned</p>
                </div>
              </div>

              {/* Issues */}
              {review.issues?.length > 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Issues Found</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {review.issues.map((issue, i) => (
                      <div key={i} style={{
                        padding: '10px 12px', borderRadius: 'var(--radius)',
                        background: 'var(--bg-secondary)',
                        borderLeft: `3px solid ${issueColor[issue.type] || 'var(--accent-blue)'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '10px', color: issueColor[issue.type], textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                            {issue.type}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>line {issue.line}</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>{issue.message}</p>
                        <p style={{ fontSize: '12px', color: 'var(--accent-blue)' }}>💡 {issue.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Positives */}
              {review.positives?.length > 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>What You Did Well</p>
                  {review.positives.map((p, i) => (
                    <p key={i} style={{ fontSize: '13px', color: 'var(--accent-green)', marginBottom: '6px' }}>✓ {p}</p>
                  ))}
                </div>
              )}

              {/* Next Steps */}
              {review.nextSteps?.length > 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Steps</p>
                  {review.nextSteps.map((step, i) => (
                    <p key={i} style={{ fontSize: '13px', color: 'var(--accent-purple)', marginBottom: '6px' }}>→ {step}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
