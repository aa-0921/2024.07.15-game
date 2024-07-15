export class Obstacle {
  constructor(x, y, width, height, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isOutOfCanvas(canvas) {
    return (
      this.x + this.width < 0 ||
      this.x > canvas.width ||
      this.y + this.height < 0 ||
      this.y > canvas.height
    );
  }
}
