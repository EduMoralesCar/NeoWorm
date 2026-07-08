import { useRef, useEffect, useCallback } from 'react';
import { Canvas, InputHandler } from '../game';

export default function GameCanvas({ game, onReady }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameRef = useRef(game);
  gameRef.current = game;

  const handleResize = useCallback((canvas) => {
    const parent = containerRef.current;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.resize(rect.width, rect.height);
  }, []);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const canvas = new Canvas(canvasEl);
    const input = new InputHandler();
    input.attach();
    handleResize(canvas);

    let lastTime = performance.now();
    let rafId;

    const loop = (currentTime) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;
      const clamped = Math.min(dt, 50);

      const currentGame = gameRef.current;

      canvas.ctx.fillStyle = '#0a0a0a';
      canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentGame) {
        const t = currentGame.theme;
        canvas.ctx.fillStyle = t?.background || '#0a0a0a';
        canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(canvas, t);
      }

      if (currentGame && !currentGame.isOver && !currentGame.paused) {
        const dir = input.direction;
        if (dir) currentGame.setDirection(dir);
        currentGame.update(clamped);
      }

      if (currentGame) {
        currentGame.render(canvas.ctx, 32, 0, 0);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const onResize = () => handleResize(canvas);
    window.addEventListener('resize', onResize);

    if (onReady) onReady({ canvas, input });

    return () => {
      cancelAnimationFrame(rafId);
      input.detach();
      window.removeEventListener('resize', onResize);
    };
  }, [onReady, handleResize]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

function drawGrid(canvas, theme) {
  const { ctx, width, height } = canvas;
  const gridSize = 32;
  ctx.strokeStyle = theme?.grid || '#1a1a1a';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
}
