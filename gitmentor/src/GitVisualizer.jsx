import React, { useState } from 'react';

export default function GitVisualizer() {
  // We start with an initial main branch and a single first commit
  const [commits, setCommits] = useState([
    { id: 'c1', message: 'Initial commit', branch: 'main' }
  ]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [branches, setBranches] = useState(['main']);

  // Simulate running 'git commit'
  const handleCommit = () => {
    const commitMsg = prompt("Enter commit message:", "feat: added new feature");
    if (!commitMsg) return;

    const newCommit = {
      id: `c${commits.length + 1}`,
      message: commitMsg,
      branch: currentBranch
    };
    setCommits([...commits, newCommit]);
  };

  // Simulate running 'git branch <name>'
  const handleCreateBranch = () => {
    const branchName = prompt("Enter new branch name:");
    if (!branchName || branches.includes(branchName)) return;

    setBranches([...branches, branchName]);
    setCurrentBranch(branchName); // Automatically switch to the new branch
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#252526', color: '#fff', borderRadius: '8px', marginTop: '20px' }}>
      <h2>🌿 Interactive Git Visualizer (Simulation)</h2>
      <p>Current active branch: <strong style={{ color: '#4fc1ff' }}>{currentBranch}</strong></p>

      {/* Control Panel Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCommit} style={buttonStyle}>💻 Run: git commit</button>
        <button onClick={handleCreateBranch} style={buttonStyle}>🌿 Run: git branch</button>
      </div>

      {/* Visual Graph Area */}
      <div style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '6px', overflowX: 'auto' }}>
        {commits.map((commit, index) => (
          <div key={commit.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: commit.branch === 'main' ? '#0e639c' : '#4ec9b0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '11px',
              padding: '5px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <strong>{commit.id.toUpperCase()}</strong>
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '70px', whiteSpace: 'nowrap' }}>{commit.message}</span>
              <span style={{ fontSize: '9px', opacity: 0.7, position: 'absolute', bottom: '5px' }}>({commit.branch})</span>
            </div>
            {index < commits.length - 1 && (
              <div style={{ width: '40px', height: '4px', backgroundColor: '#5a5a5a' }}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const buttonStyle = {
  marginRight: '10px',
  padding: '8px 15px',
  backgroundColor: '#3c3c3c',
  color: '#fff',
  border: '1px solid #5a5a5a',
  borderRadius: '4px',
  cursor: 'pointer'
};