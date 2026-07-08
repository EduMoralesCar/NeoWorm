export class Food {
  constructor() {
    this.position = { x: 0, y: 0 };
  }

  spawn(gridWidth, gridHeight, isOccupied) {
    let x, y;
    do {
      x = Math.floor(Math.random() * gridWidth);
      y = Math.floor(Math.random() * gridHeight);
    } while (isOccupied(x, y));
    this.position = { x, y };
  }

  draw(ctx, cellSize, theme, ox, oy) {
    const { x, y } = this.position;
    const cx = ox + x * cellSize + cellSize / 2;
    const cy = oy + y * cellSize + cellSize / 2;
    const r = cellSize / 2 - Math.max(3, cellSize * 0.08);

    const color = theme?.food || '#ff3344';
    const highlight = theme?.foodHighlight || '#ff6677';
    const glow = theme?.foodGlow || '#ff3344';

    ctx.fillStyle = color;
    ctx.shadowColor = glow;
    ctx.shadowBlur = Math.min(14, cellSize * 0.4);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = highlight;
    const hr = Math.max(2, cellSize * 0.08);
    ctx.beginPath();
    ctx.arc(cx - hr * 0.8, cy - hr * 0.8, hr, 0, Math.PI * 2);
    ctx.fill();
  }
}
