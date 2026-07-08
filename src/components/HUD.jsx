export default function HUD({ score = 0, level = 1, speed = 1 }) {
  return (
    <header style={styles.bar}>
      <span style={styles.item}>Score: {score}</span>
      <span style={styles.item}>Level: {level}</span>
      <span style={styles.item}>Speed: {speed}x</span>
    </header>
  );
}

const styles = {
  bar: {
    height: '44px', minHeight: '44px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 16px',
    background: '#0d0d0d', borderBottom: '1px solid #1a1a1a',
    color: '#fff', fontFamily: 'monospace', fontSize: '13px', zIndex: 20,
  },
  item: { fontWeight: 'bold' },
};
