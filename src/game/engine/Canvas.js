export class Canvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = 0;
    this.height = 0;
  }

  resize(width, height) {
    const scale = this.scale;
    this.width = width;
    this.height = height;
    this.canvas.width = width * scale;
    this.canvas.height = height * scale;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  get scale() {
    return window.devicePixelRatio || 1;
  }
}
