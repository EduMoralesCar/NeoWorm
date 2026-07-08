export default function PauseMenu({ score, level, onResume, onRestart, onExit }) {
  return (
    <div style={styles.overlay}>
      <h2 style={styles.title}>Paused</h2>
      <div style={styles.stats}>
        <span>Score: {score}</span>
        <span>Level: {level}</span>
      </div>
      <div style={styles.actions}>
        <button style={styles.button} onClick={onResume}>Resume</button>
        <button style={styles.buttonSecondary} onClick={onRestart}>Restart</button>
        <button style={styles.buttonDanger} onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.8)',
    zIndex: 30,
    gap: '20px',
  },
  title: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '2rem',
    margin: 0,
    letterSpacing: '4px',
    textTransform: 'uppercase',
  },
  stats: {
    display: 'flex',
    gap: '24px',
    color: '#aaa',
    fontFamily: 'monospace',
    fontSize: '0.95rem',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '8px',
  },
  button: {
    padding: '10px 40px',
    fontSize: '1rem',
    fontFamily: 'monospace',
    background: '#0f0',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  buttonSecondary: {
    padding: '10px 40px',
    fontSize: '1rem',
    fontFamily: 'monospace',
    background: 'transparent',
    color: '#ccc',
    border: '1px solid #555',
    borderRadius: '4px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  buttonDanger: {
    padding: '10px 40px',
    fontSize: '1rem',
    fontFamily: 'monospace',
    background: 'transparent',
    color: '#ff4444',
    border: '1px solid #ff4444',
    borderRadius: '4px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
};
