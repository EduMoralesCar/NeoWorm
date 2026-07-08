export class InputHandler {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown(e) {
    if (!this.keys[e.code]) {
      this.justPressed[e.code] = true;
    }
    this.keys[e.code] = true;
  }

  onKeyUp(e) {
    this.keys[e.code] = false;
  }

  isDown(code) {
    return !!this.keys[code];
  }

  wasPressed(code) {
    if (this.justPressed[code]) {
      this.justPressed[code] = false;
      return true;
    }
    return false;
  }

  get direction() {
    if (this.isDown('ArrowUp') || this.isDown('KeyW')) return 'UP';
    if (this.isDown('ArrowDown') || this.isDown('KeyS')) return 'DOWN';
    if (this.isDown('ArrowLeft') || this.isDown('KeyA')) return 'LEFT';
    if (this.isDown('ArrowRight') || this.isDown('KeyD')) return 'RIGHT';
    return null;
  }
}
