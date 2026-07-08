import { useState, useCallback, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import PauseMenu from './components/PauseMenu';
import ThemePicker from './components/ThemePicker';
import { useGameState } from './hooks/useGameState';
import { Game } from './game';

const GRID_COLS = 20;
const GRID_ROWS = 15;

export default function App() {
  const { status, startGame, pauseGame, resumeGame, gameOver, goToMenu } = useGameState();
  const [gameInstance, setGameInstance] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [themeIndex, setThemeIndex] = useState(null);
  const engineRef = useRef(null);
  const gameRef = useRef(null);

  const createGame = useCallback(() => {
    const { canvas } = engineRef.current;
    if (!canvas) return null;
    const game = new Game({
      gridCols: GRID_COLS, gridRows: GRID_ROWS, themeIndex,
      onScore: (s) => setScore(s),
      onLevelUp: (l) => setLevel(l),
      onGameOver: () => gameOver(),
    });
    gameRef.current = game;
    return game;
  }, [gameOver, themeIndex]);

  const handleCanvasReady = useCallback((engine) => { engineRef.current = engine; }, []);

  const handlePlay = useCallback(() => {
    const game = createGame();
    if (!game) return;
    setGameInstance(game); setScore(0); setLevel(1); startGame();
  }, [createGame, startGame]);

  const handlePause = useCallback(() => {
    const game = gameRef.current;
    if (game && !game.isOver) { game.togglePause(); pauseGame(); }
  }, [pauseGame]);

  const handleResume = useCallback(() => {
    const game = gameRef.current;
    if (game) { game.togglePause(); resumeGame(); }
  }, [resumeGame]);

  const handleRestart = useCallback(() => {
    const game = createGame();
    if (!game) return;
    setGameInstance(game); setScore(0); setLevel(1); startGame();
  }, [createGame, startGame]);

  const handleExit = useCallback(() => {
    gameRef.current = null; setGameInstance(null); goToMenu();
  }, [goToMenu]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape') {
        if (status === 'playing') handlePause();
        else if (status === 'paused') handleResume();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, handlePause, handleResume]);

  return (
    <Layout>
      {status === 'playing' && <HUD score={score} level={level} speed={level} onPause={handlePause} />}
      <div style={{ flex: 1, position: 'relative' }}>
        <GameCanvas game={gameInstance} onReady={handleCanvasReady} />
        {status === 'menu' && (
          <div style={styles.overlay}>
            <h1 style={styles.title}>NeoWorm</h1>
            <p style={styles.subtitle}>a classic snake reimagined</p>
            <ThemePicker selected={themeIndex} onSelect={setThemeIndex} />
            <button style={styles.button} onClick={handlePlay}>Play</button>
          </div>
        )}
        {status === 'paused' && (
          <PauseMenu score={score} level={level} onResume={handleResume} onRestart={handleRestart} onExit={handleExit} />
        )}
        {status === 'gameover' && (
          <div style={styles.overlay}>
            <h2 style={styles.title}>Game Over</h2>
            <p style={styles.scoreText}>Score: {score}</p>
            <button style={styles.button} onClick={handleRestart}>Play Again</button>
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
    background: 'linear-gradient(135deg, #000000, #001a00, #000a10, #000000)',
    backgroundSize: '400% 400%',
    zIndex: 20, gap: '16px',
    animation: 'gradient-shift 8s ease-in-out infinite',
  },
  title: {
    color: '#0f0', fontFamily: 'monospace', fontSize: '3rem', margin: 0,
    letterSpacing: '6px', textTransform: 'uppercase',
    animation: 'pulse-glow 2.5s ease-in-out infinite',
  },
  subtitle: {
    color: '#666', fontFamily: 'monospace', fontSize: '0.8rem',
    margin: '-8px 0 8px', letterSpacing: '3px', textTransform: 'uppercase',
  },
  scoreText: { color: '#fff', fontFamily: 'monospace', fontSize: '1.2rem', margin: 0 },
  button: {
    padding: '14px 48px', fontSize: '1.1rem', fontFamily: 'monospace',
    background: '#0f0', color: '#000', border: 'none', borderRadius: '4px',
    cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase',
    letterSpacing: '3px', animation: 'pulse-button 2s ease-in-out infinite',
  },
};
