import { Player } from './player.js';
import { Obstacle } from './obstacle.js';
import { BonusPoint } from './bonusPoint.js';

export class Game {
  constructor(canvas, scoreBoard, startButton, restartButton) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scoreBoard = scoreBoard;
    this.startButton = startButton;
    this.restartButton = restartButton;

    this.player = new Player(canvas.width / 2 - 25, canvas.height / 2 - 25);
    this.obstacles = [];
    this.bonusPoints = [];
    this.initialObstacleFrequency = 30;
    this.obstacleFrequency = this.initialObstacleFrequency;
    this.frameCount = 0;
    this.score = 0;
    this.gameOver = false;
    this.bonusScore = 0;
    this.bonusCount = 0;
    this.keys = {
      right: false,
      left: false,
      up: false,
      down: false,
    };

    this.gameOverImage = new Image();
    this.gameOverImage.src = 'image.png';

    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowRight') this.keys.right = true;
    if (e.key === 'ArrowLeft') this.keys.left = true;
    if (e.key === 'ArrowUp') this.keys.up = true;
    if (e.key === 'ArrowDown') this.keys.down = true;
  }

  handleKeyUp(e) {
    if (e.key === 'ArrowRight') this.keys.right = false;
    if (e.key === 'ArrowLeft') this.keys.left = false;
    if (e.key === 'ArrowUp') this.keys.up = false;
    if (e.key === 'ArrowDown') this.keys.down = false;
  }

  movePlayer(direction) {
    if (direction === 'up' && this.player.y > 0) {
      this.player.moveUp();
    }
    if (
      direction === 'down' &&
      this.player.y + this.player.height < this.canvas.height
    ) {
      this.player.moveDown();
    }
    if (direction === 'left' && this.player.x > 0) {
      this.player.moveLeft();
    }
    if (
      direction === 'right' &&
      this.player.x + this.player.width < this.canvas.width
    ) {
      this.player.moveRight();
    }
  }

  generateObstacle() {
    const size = Math.random() * 30 + 20;
    const side = Math.floor(Math.random() * 4);
    let x, y, speedX, speedY;

    switch (side) {
      case 0: // 上から
        x = Math.random() * this.canvas.width;
        y = -size;
        speedX = (Math.random() - 0.5) * 10;
        speedY = Math.random() * 5 + 2;
        break;
      case 1: // 右から
        x = this.canvas.width + size;
        y = Math.random() * this.canvas.height;
        speedX = -(Math.random() * 5 + 2);
        speedY = (Math.random() - 0.5) * 10;
        break;
      case 2: // 下から
        x = Math.random() * this.canvas.width;
        y = this.canvas.height + size;
        speedX = (Math.random() - 0.5) * 10;
        speedY = -(Math.random() * 5 + 2);
        break;
      case 3: // 左から
        x = -size;
        y = Math.random() * this.canvas.height;
        speedX = Math.random() * 5 + 2;
        speedY = (Math.random() - 0.5) * 10;
        break;
    }

    this.obstacles.push(new Obstacle(x, y, size, size, speedX, speedY));
  }

  generateBonusPoint() {
    const size = 20;
    const x = Math.random() * (this.canvas.width - size);
    const y = Math.random() * (this.canvas.height - size);
    this.bonusPoints.push(new BonusPoint(x, y, size, size));
  }

  updateObstacles() {
    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i];
      obs.update();

      if (obs.isOutOfCanvas(this.canvas)) {
        this.obstacles.splice(i, 1);
        i--;
      }
    }
  }

  checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  gameLoop() {
    if (this.gameOver) {
      this.ctx.drawImage(
        this.gameOverImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      this.ctx.fillStyle = 'black';
      this.ctx.font = '50px Arial';
      this.ctx.fillText(
        'Game Over',
        this.canvas.width / 2 - 150,
        this.canvas.height / 2 - 30
      );

      const finalScore = this.score + this.bonusScore;
      this.ctx.font = '30px Arial';
      this.ctx.fillText(
        `Final Score: ${finalScore}`,
        this.canvas.width / 2 - 110,
        this.canvas.height / 2 + 20
      );

      this.restartButton.style.display = 'block';
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (
      this.keys.right &&
      this.player.x + this.player.width < this.canvas.width
    )
      this.player.moveRight();
    if (this.keys.left && this.player.x > 0) this.player.moveLeft();
    if (this.keys.up && this.player.y > 0) this.player.moveUp();
    if (
      this.keys.down &&
      this.player.y + this.player.height < this.canvas.height
    )
      this.player.moveDown();

    this.player.draw(this.ctx);

    if (this.frameCount % this.obstacleFrequency === 0) this.generateObstacle();
    this.updateObstacles();

    if (this.frameCount % 500 === 0) this.generateBonusPoint();

    this.ctx.fillStyle = 'red';
    this.obstacles.forEach((obs) => obs.draw(this.ctx));

    this.ctx.fillStyle = 'pink';
    this.bonusPoints.forEach((bonus) => bonus.draw(this.ctx));

    this.obstacles.forEach((obs) => {
      if (this.checkCollision(this.player, obs)) {
        this.gameOver = true;
      }
    });

    for (let i = 0; i < this.bonusPoints.length; i++) {
      if (this.checkCollision(this.player, this.bonusPoints[i])) {
        this.bonusScore += 100;
        this.bonusCount++;
        this.bonusPoints.splice(i, 1);
        i--;
      }
    }

    this.score++;
    this.scoreBoard.innerText = `Score: ${this.score} + Bonus: ${this.bonusScore}`;

    this.frameCount++;
    requestAnimationFrame(() => this.gameLoop());
  }

  initGame() {
    this.player.x = this.canvas.width / 2 - 25;
    this.player.y = this.canvas.height / 2 - 25;
    this.obstacles = [];
    this.bonusPoints = [];
    this.frameCount = 0;
    this.score = 0;
    this.gameOver = false;
    this.bonusScore = 0;
    this.bonusCount = 0;
    this.obstacleFrequency = this.initialObstacleFrequency;
    this.restartButton.style.display = 'none';
    this.scoreBoard.innerText = `Score: 0 + Bonus: 0`;
    this.gameLoop();
  }
}
