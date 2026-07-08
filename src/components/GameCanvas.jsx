import { useRef, useEffect, useCallback } from 'react';
import { Canvas, InputHandler } from '../game';

const COLS = 20;
const ROWS = 15;
const PARTICLE_COUNT = 60;

export default function GameCanvas({ game, status, onReady }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameRef = useRef(game);
  gameRef.current = game;
  const particlesRef = useRef(null);
  const playAreaRef = useRef({ cellSize: 32, ox: 0, oy: 0 });

  const recalcPlayArea = useCallback((w, h) => {
    const cellSize = Math.max(8, Math.floor(Math.min(w / COLS, h / ROWS)));
    const pw = COLS * cellSize;
    const ph = ROWS * cellSize;
    playAreaRef.current = {
      cellSize,
      ox: Math.floor((w - pw) / 2),
      oy: Math.floor((h - ph) / 2),
      pw,
      ph,
    };
  }, []);

  const handleResize = useCallback((canvas) => {
    const parent = containerRef.current;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.resize(rect.width, rect.height);
    recalcPlayArea(rect.width, rect.height);
  }, [recalcPlayArea]);

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
      const { cellSize, ox, oy, pw, ph } = playAreaRef.current;

      canvas.ctx.fillStyle = '#000';
      canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isMenu) {
        updateParticles(particlesRef.current, canvas.width, canvas.height, clamped);
        drawParticles(canvas.ctx, particlesRef.current);
      } else {
        const t = currentGame.theme;
        canvas.ctx.fillStyle = t?.background || '#0a0a0a';
        canvas.ctx.fillRect(ox, oy, pw, ph);
        drawGrid(canvas.ctx, ox, oy, pw, ph, cellSize, t);
        drawBorder(canvas.ctx, ox, oy, pw, ph);
      }

      if (currentGame && !currentGame.isOver && !currentGame.paused) {
        const dir = input.direction;
        if (dir) currentGame.setDirection(dir);
        currentGame.update(clamped);
      }

      if (currentGame) {
        currentGame.render(canvas.ctx, cellSize, ox, oy);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const onResize = () => {
      handleResize(canvas);
      if (particlesRef.current) {
        particlesRef.current = createParticles(canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', onResize);

    if (onReady) {
      onReady({ canvas, input });
    }

    return () => {
      cancelAnimationFrame(rafId);
      input.detach();
      window.removeEventListener('resize', onResize);
    };
  }, [onReady, handleResize, recalcPlayArea]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block' }}
      />
    </div>
  );
}

function drawGrid(ctx, ox, oy, pw, ph, cellSize, theme) {
  ctx.strokeStyle = theme?.grid || '#1a1a1a';
  ctx.lineWidth = 1;

  for (let x = ox; x <= ox + pw; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, oy);
    ctx.lineTo(x, oy + ph);
    ctx.stroke();
  }

  for (let y = oy; y <= oy + ph; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(ox, y);
    ctx.lineTo(ox + pw, y);
    ctx.stroke();
  }
}

function drawBorder(ctx, ox, oy, pw, ph) {
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox, oy, pw, ph);
}

function createParticles(w, h) {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.5,
    a: Math.random() * 0.4 + 0.1,
  }));
}

function updateParticles(particles, w, h, dt) {
  const speed = dt * 0.06;
  for (const p of particles) {
    p.x += p.vx * speed;
    p.y += p.vy * speed;
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;
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
