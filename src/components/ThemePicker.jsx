import { THEMES } from '../game';

export default function ThemePicker({ selected, onSelect }) {
  const themes = THEMES.filter(Boolean);

  return (
    <div style={styles.wrapper}>
      <p style={styles.label}>theme</p>
      <div style={styles.grid}>
        {themes.map((t, i) => (
          <button
            key={i}
            onClick={() => onSelect(i + 1)}
            style={{
              ...styles.card,
              background: t.background,
              borderColor: selected === i + 1 ? t.snakeHead : '#333',
              boxShadow: selected === i + 1 ? `0 0 8px ${t.snakeHead}` : 'none',
            }}
            title={t.name}
          >
            <span style={{ ...styles.dot, background: t.snakeHead }} />
            <span style={styles.cardName}>{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    color: '#555',
    fontFamily: 'monospace',
    fontSize: '0.7rem',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    margin: 0,
  },
  grid: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '360px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    border: '1px solid #333',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: '#111',
  },
  dot: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
  },
  cardName: {
    color: '#aaa',
    fontFamily: 'monospace',
    fontSize: '0.6rem',
    whiteSpace: 'nowrap',
  },
};
