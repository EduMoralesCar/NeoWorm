const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITES = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export class Snake {
  constructor(startX, startY) {
    this.segments = [{ x: startX, y: startY }];
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.growing = false;
  }

  setDirection(dir) {
    if (dir && OPPOSITES[dir] !== this.direction) {
      this.nextDirection = dir;
    }
  }

  move(gridWidth, gridHeight) {
    this.direction = this.nextDirection;
    const move = DIRECTIONS[this.direction];
    const head = this.segments[0];
    const newHead = { x: head.x + move.x, y: head.y + move.y };
    this.segments.unshift(newHead);
    if (!this.growing) this.segments.pop();
    else this.growing = false;
  }

  grow() { this.growing = true; }

  checkSelfCollision() {
    const head = this.segments[0];
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].x === head.x && this.segments[i].y === head.y) return true;
    }
    return false;
  }

  checkWallCollision(gridWidth, gridHeight) {
    const head = this.segments[0];
    return head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight;
  }

  occupies(x, y) {
    return this.segments.some((s) => s.x === x && s.y === y);
  }

  draw(ctx, cellSize, theme, ox, oy) {
    const headColor = theme?.snakeHead || '#00ff44';
    const bodyColor = theme?.snakeBody || '#00cc33';
    const glow = theme?.snakeGlow || '#00ff44';
    const gap = Math.max(1, Math.floor(cellSize * 0.06));
    const size = cellSize - gap * 2;

    this.segments.forEach((seg, i) => {
      const isHead = i === 0;
      const sx = ox + seg.x * cellSize + gap;
      const sy = oy + seg.y * cellSize + gap;

      ctx.fillStyle = isHead ? headColor : bodyColor;
      ctx.shadowColor = glow;
      ctx.shadowBlur = isHead ? Math.min(14, cellSize * 0.4) : Math.min(6, cellSize * 0.2);

      if (isHead) {
        const r = Math.max(2, Math.floor(cellSize * 0.13));
        ctx.beginPath();
        ctx.moveTo(sx + r, sy);
        ctx.lineTo(sx + size - r, sy);
        ctx.quadraticCurveTo(sx + size, sy, sx + size, sy + r);
        ctx.lineTo(sx + size, sy + size - r);
        ctx.quadraticCurveTo(sx + size, sy + size, sx + size - r, sy + size);
        ctx.lineTo(sx + r, sy + size);
        ctx.quadraticCurveTo(sx, sy + size, sx, sy + size - r);
        ctx.lineTo(sx, sy + r);
        ctx.quadraticCurveTo(sx, sy, sx + r, sy);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(sx + 2, sy + 2, size - 4, size - 4);
      }

      ctx.shadowBlur = 0;
    });
  }
}
