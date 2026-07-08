import { Snake } from './entities/Snake.js';
import { Food } from './entities/Food.js';
import { getTheme } from './themes.js';

export class Game {
  constructor({ gridWidth, gridHeight, gridSize, onScore, onGameOver, onLevelUp }) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.gridSize = gridSize;
    this.onScore = onScore;
    this.onGameOver = onGameOver;
    this.onLevelUp = onLevelUp;

    this.snake = new Snake(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2));
    this.food = new Food();
    this.score = 0;
    this.level = 1;
    this.theme = getTheme(1);
    this.moveInterval = 200;
    this.moveTimer = 0;
    this.isOver = false;
    this.paused = false;

    this.food.spawn(gridWidth, gridHeight, (x, y) => this.snake.occupies(x, y));
  }

  togglePause() { this.paused = !this.paused; }
  setDirection(dir) { this.snake.setDirection(dir); }

  update(dt) {
    if (this.isOver || this.paused) return;
    this.moveTimer += dt;
    while (this.moveTimer >= this.moveInterval) {
      this.moveTimer -= this.moveInterval;
      this.snake.move(this.gridWidth, this.gridHeight);
      const head = this.snake.segments[0];
      if (head.x === this.food.position.x && head.y === this.food.position.y) {
        this.snake.grow();
        this.score += 10;
        this.food.spawn(this.gridWidth, this.gridHeight, (x, y) => this.snake.occupies(x, y));
        if (this.score % 50 === 0) {
          this.level++;
          this.theme = getTheme(this.level);
          this.moveInterval = Math.max(60, this.moveInterval - 20);
          this.onLevelUp?.(this.level);
        }
        this.onScore?.(this.score);
      }
      if (this.snake.checkSelfCollision() || this.snake.checkWallCollision(this.gridWidth, this.gridHeight)) {
        this.isOver = true;
        this.onGameOver?.();
      }
    }
  }

  render(ctx, cellSize, ox, oy) {
    this.snake.draw(ctx, cellSize, this.theme, ox, oy);
    this.food.draw(ctx, cellSize, this.theme, ox, oy);
  }
}
