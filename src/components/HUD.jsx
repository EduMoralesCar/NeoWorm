export default function HUD({ score = 0, level = 1, speed = 1, onPause }) {
  return (
    <header style={styles.bar}>
      <div style={styles.left}>
        <span>Score: {score}</span>
      </div>
      <div style={styles.center}>
        <span>Level {level} | {speed}x</span>
      </div>
      <div style={styles.right}>
        <button onClick={onPause} style={styles.pauseBtn} aria-label="Pause">II</button>
      </div>
    </header>
  );
}

const styles = {
  bar: {
    height: '44px', minHeight: '44px', display: 'flex', alignItems: 'center',
    padding: '0 16px', background: '#0d0d0d', borderBottom: '1px solid #1a1a1a',
    color: '#fff', fontFamily: 'monospace', fontSize: '13px', zIndex: 20,
  },
  left: { flex: 1, display: 'flex', alignItems: 'center' },
  center: { flex: 1, display: 'flex', justifyContent: 'center', color: '#aaa' },
  right: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  pauseBtn: {
    width: '32px', height: '32px', background: 'transparent',
    border: '1px solid #333', borderRadius: '6px', color: '#888',
    cursor: 'pointer', fontSize: '12px',
  },
};
