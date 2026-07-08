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
    this.blinkTimer = 0;
    this.isBlinking = false;
    this.tongueTimer = 0;
    this.tongueOut = false;
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
    const newHead = {
      x: head.x + move.x,
      y: head.y + move.y,
    };

    this.segments.unshift(newHead);

    if (!this.growing) {
      this.segments.pop();
    } else {
      this.growing = false;
    }
  }

  grow() {
    this.growing = true;
  }

  checkSelfCollision() {
    const head = this.segments[0];
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].x === head.x && this.segments[i].y === head.y) {
        return true;
      }
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

    for (let i = this.segments.length - 1; i >= 0; i--) {
      const seg = this.segments[i];
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
        this.#drawScales(ctx, ox, oy, seg, cellSize, theme);
      }

      ctx.shadowBlur = 0;

      if (isHead) {
        this.#drawEyes(ctx, sx, sy, size);
        this.#drawTongue(ctx, sx, sy, size);
      }
    }
  }

  #drawEyes(ctx, x, y, size) {
    this.blinkTimer++;
    if (this.blinkTimer > 180) {
      this.isBlinking = true;
      if (this.blinkTimer > 186) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    const cx = x + size / 2;
    const cy = y + size / 2;
    const offset = size * 0.25;
    const eyeR = Math.max(1.5, size * 0.12);
    const pupilR = eyeR * 0.55;

    let ex1, ey1, ex2, ey2;

    switch (this.direction) {
      case 'RIGHT':
        ex1 = cx + offset; ey1 = cy - offset;
        ex2 = cx + offset; ey2 = cy + offset;
        break;
      case 'LEFT':
        ex1 = cx - offset; ey1 = cy - offset;
        ex2 = cx - offset; ey2 = cy + offset;
        break;
      case 'UP':
        ex1 = cx - offset; ey1 = cy - offset;
        ex2 = cx + offset; ey2 = cy - offset;
        break;
      case 'DOWN':
        ex1 = cx - offset; ey1 = cy + offset;
        ex2 = cx + offset; ey2 = cy + offset;
        break;
      default:
        ex1 = cx + offset; ey1 = cy - offset;
        ex2 = cx + offset; ey2 = cy + offset;
    }

    if (this.isBlinking) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(1, size * 0.04);
      ctx.beginPath();
      ctx.moveTo(ex1 - eyeR, ey1);
      ctx.lineTo(ex1 + eyeR, ey1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex2 - eyeR, ey2);
      ctx.lineTo(ex2 + eyeR, ey2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(ex1, ey1, pupilR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex2, ey2, pupilR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  #drawTongue(ctx, x, y, size) {
    this.tongueTimer++;
    if (this.tongueTimer > 90) {
      this.tongueOut = !this.tongueOut;
      this.tongueTimer = 0;
    }

    if (!this.tongueOut) return;

    const cx = x + size / 2;
    const cy = y + size / 2;
    const len = size * 0.5;

    let tx, ty, dx, dy;

    switch (this.direction) {
      case 'RIGHT':
        tx = cx + size / 2; ty = cy;
        dx = len; dy = 0;
        break;
      case 'LEFT':
        tx = cx - size / 2; ty = cy;
        dx = -len; dy = 0;
        break;
      case 'UP':
        tx = cx; ty = cy - size / 2;
        dx = 0; dy = -len;
        break;
      case 'DOWN':
        tx = cx; ty = cy + size / 2;
        dx = 0; dy = len;
        break;
      default: return;
    }

    ctx.strokeStyle = '#ff4466';
    ctx.lineWidth = Math.max(1, size * 0.04);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + dx, ty + dy);
    ctx.stroke();

    const fx = tx + dx;
    const fy = ty + dy;
    const perpX = -dy * 0.3;
    const perpY = dx * 0.3;

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + perpX + dx * 0.2, fy + perpY + dy * 0.2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx - perpX + dx * 0.2, fy - perpY + dy * 0.2);
    ctx.stroke();
  }

  #drawScales(ctx, ox, oy, seg, cellSize, theme) {
    const dotColor = theme?.snakeGlow || '#00ff44';
    const sx = ox + seg.x * cellSize + cellSize / 2;
    const sy = oy + seg.y * cellSize + cellSize / 2;
    const r = Math.max(1, cellSize * 0.06);

    ctx.fillStyle = dotColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
