import { useState, useCallback, useRef } from 'react';
import Layout from './components/Layout';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import { useGameState } from './hooks/useGameState';
import { Game } from './game';

const GRID_SIZE = 32;

export default function App() {
  const { status, startGame, gameOver, goToMenu } = useGameState();
  const [gameInstance, setGameInstance] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const engineRef = useRef(null);

  const handleCanvasReady = useCallback((engine) => { engineRef.current = engine; }, []);

  const handlePlay = useCallback(() => {
    const { canvas } = engineRef.current;
    if (!canvas) return;
    const gridWidth = Math.floor(canvas.width / GRID_SIZE);
    const gridHeight = Math.floor(canvas.height / GRID_SIZE);
    const game = new Game({
      gridWidth, gridHeight, gridSize: GRID_SIZE,
      onScore: (s) => setScore(s),
      onLevelUp: (l) => setLevel(l),
      onGameOver: () => gameOver(),
    });
    setGameInstance(game);
    setScore(0); setLevel(1);
    startGame();
  }, [startGame, gameOver]);

  const handleMenu = useCallback(() => {
    setGameInstance(null);
    goToMenu();
  }, [goToMenu]);

  return (
    <Layout>
      {status === 'playing' && <HUD score={score} level={level} speed={level} />}
      <div style={{ flex: 1, position: 'relative' }}>
        <GameCanvas game={gameInstance} onReady={handleCanvasReady} />
        {status === 'menu' && (
          <div style={styles.overlay}>
            <h1 style={styles.title}>NeoWorm</h1>
            <button style={styles.button} onClick={handlePlay}>Play</button>
          </div>
        )}
        {status === 'gameover' && (
          <div style={styles.overlay}>
            <h2 style={styles.title}>Game Over</h2>
            <p style={styles.scoreText}>Score: {score}</p>
            <button style={styles.button} onClick={handleMenu}>Menu</button>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  overlay: {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,0,0,0.85)', zIndex: 20, gap: '16px',
  },
  title: {
    color: '#0f0', fontFamily: 'monospace', fontSize: '2.5rem', margin: 0,
    textShadow: '0 0 10px #0f0',
  },
  scoreText: { color: '#fff', fontFamily: 'monospace', fontSize: '1.2rem', margin: 0 },
  button: {
    padding: '12px 32px', fontSize: '1.1rem', fontFamily: 'monospace',
    background: '#0f0', color: '#000', border: 'none', borderRadius: '4px',
    cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase',
  },
};
