import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const scoreBoard = document.getElementById('scoreBoard');
  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restartButton');

  const game = new Game(canvas, scoreBoard, startButton, restartButton);

  startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    game.initGame();
  });

  restartButton.addEventListener('click', () => {
    game.initGame();
  });
});
