export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.rafId = null;
    this.lastTime = 0;
    this.accumulator = 0;
    this.timestep = 1000 / 60;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop(this.lastTime);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  loop = (currentTime) => {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.timestep) {
      this.update(this.timestep);
      this.accumulator -= this.timestep;
    }

    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };
}
