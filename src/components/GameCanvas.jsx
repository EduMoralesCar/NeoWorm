import { useRef, useEffect, useCallback } from 'react';
import { Canvas, InputHandler } from '../game';

const PARTICLE_COUNT = 60;

export default function GameCanvas({ game, onReady }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameRef = useRef(game);
  gameRef.current = game;
  const particlesRef = useRef(null);

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
    particlesRef.current = createParticles(canvas.width, canvas.height);

    let lastTime = performance.now();
    let rafId;

    const loop = (currentTime) => {
      const dt = currentTime - lastTime;
      lastTime = currentTime;
      const clamped = Math.min(dt, 50);

      const currentGame = gameRef.current;
      const isMenu = !currentGame;

      canvas.ctx.fillStyle = '#0a0a0a';
      canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isMenu) {
        updateParticles(particlesRef.current, canvas.width, canvas.height, clamped);
        drawParticles(canvas.ctx, particlesRef.current);
      } else if (currentGame) {
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

    const onResize = () => {
      handleResize(canvas);
      if (particlesRef.current) particlesRef.current = createParticles(canvas.width, canvas.height);
    };
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

function createParticles(w, h) {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.5, a: Math.random() * 0.4 + 0.1,
  }));
}

function updateParticles(particles, w, h, dt) {
  const speed = dt * 0.06;
  for (const p of particles) {
    p.x += p.vx * speed; p.y += p.vy * speed;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
  }
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = p.a;
    ctx.fillStyle = '#00ff44';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
