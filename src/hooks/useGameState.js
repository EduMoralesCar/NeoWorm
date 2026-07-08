import { useState, useCallback } from 'react';

const INITIAL = { status: 'menu' };

export function useGameState() {
  const [{ status }, setState] = useState(INITIAL);
  const startGame = useCallback(() => setState({ status: 'playing' }), []);
  const pauseGame = useCallback(() => setState({ status: 'paused' }), []);
  const resumeGame = useCallback(() => setState({ status: 'playing' }), []);
  const gameOver = useCallback(() => setState((p) => ({ ...p, status: 'gameover' })), []);
  const goToMenu = useCallback(() => setState(INITIAL), []);
  return { status, startGame, pauseGame, resumeGame, gameOver, goToMenu };
}
