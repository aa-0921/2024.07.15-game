import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const scoreBoard = document.getElementById('scoreBoard');
  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restartButton');

  const game = new Game(canvas, scoreBoard, startButton, restartButton);

  startButton.addEventListener('click', () => {
    game.initGame();
    startButton.style.display = 'none';
  });

  restartButton.addEventListener('click', () => {
    game.initGame();
  });

  let moveInterval;

  // 十字キーのイベントリスナーを追加
  const addDirectionalListeners = (element, direction) => {
    element.addEventListener('mousedown', () => {
      game.movePlayer(direction);
      moveInterval = setInterval(() => game.movePlayer(direction), 100); // 100msごとに移動
    });

    element.addEventListener('mouseup', () => {
      clearInterval(moveInterval);
    });

    element.addEventListener('mouseleave', () => {
      clearInterval(moveInterval);
    });

    element.addEventListener('touchstart', () => {
      game.movePlayer(direction);
      moveInterval = setInterval(() => game.movePlayer(direction), 100);
    });

    element.addEventListener('touchend', () => {
      clearInterval(moveInterval);
    });
  };

  addDirectionalListeners(document.getElementById('up'), 'up');
  addDirectionalListeners(document.getElementById('down'), 'down');
  addDirectionalListeners(document.getElementById('left'), 'left');
  addDirectionalListeners(document.getElementById('right'), 'right');
});
