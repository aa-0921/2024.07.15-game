const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard'); // スコアボードの取得
const restartButton = document.getElementById('restartButton'); // リスタートボタンの取得

// プレイヤーの設定
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height / 2 - 25,
  width: 50,
  height: 50,
  speed: 5,
};

// 障害物の設定
const obstacles = [];
const bonusPoints = []; // ボーナスポイントの設定
const initialObstacleFrequency = 30; // 初期の障害物生成頻度（今の倍の速さ）
let obstacleFrequency = initialObstacleFrequency;
let frameCount = 0;

// スコアの設定
let score = 0;
let gameOver = false;
let bonusScore = 0; // 取得したボーナスポイント数
let bonusCount = 0; // 取得したボーナスポイントの数

// キーの状態を追跡
const keys = {
  right: false,
  left: false,
  up: false,
  down: false,
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowUp') keys.up = true;
  if (e.key === 'ArrowDown') keys.down = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowUp') keys.up = false;
  if (e.key === 'ArrowDown') keys.down = false;
});

// 画像の読み込み
const gameOverImage = new Image();
gameOverImage.src = 'image.png';

// 障害物の生成
function generateObstacle() {
  const size = Math.random() * 30 + 20;
  const side = Math.floor(Math.random() * 4);
  let x, y, speedX, speedY;

  switch (side) {
    case 0: // 上から
      x = Math.random() * canvas.width;
      y = -size;
      speedX = (Math.random() - 0.5) * 10;
      speedY = Math.random() * 5 + 2;
      break;
    case 1: // 右から
      x = canvas.width + size;
      y = Math.random() * canvas.height;
      speedX = -(Math.random() * 5 + 2);
      speedY = (Math.random() - 0.5) * 10;
      break;
    case 2: // 下から
      x = Math.random() * canvas.width;
      y = canvas.height + size;
      speedX = (Math.random() - 0.5) * 10;
      speedY = -(Math.random() * 5 + 2);
      break;
    case 3: // 左から
      x = -size;
      y = Math.random() * canvas.height;
      speedX = Math.random() * 5 + 2;
      speedY = (Math.random() - 0.5) * 10;
      break;
  }

  obstacles.push({ x, y, width: size, height: size, speedX, speedY });
}

// ボーナスポイントの生成
function generateBonusPoint() {
  const size = 20;
  const x = Math.random() * (canvas.width - size);
  const y = Math.random() * (canvas.height - size);
  bonusPoints.push({ x, y, width: size, height: size });
}

// 障害物の更新
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x += obs.speedX;
    obs.y += obs.speedY;

    // 障害物が画面外に出た場合
    if (
      obs.x < -obs.width ||
      obs.x > canvas.width + obs.width ||
      obs.y < -obs.height ||
      obs.y > canvas.height + obs.height
    ) {
      obstacles.splice(i, 1);
      i--;
    }
  }
}

// 衝突判定
function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// ゲームループ
function gameLoop() {
  if (gameOver) {
    // 画像を画面全体に表示
    ctx.drawImage(gameOverImage, 0, 0, canvas.width, canvas.height);

    // ゲームオーバーの文字を表示
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2 - 30);

    // 最終スコアを表示
    const finalScore = score + bonusScore;
    ctx.font = '30px Arial';
    ctx.fillText(
      `Final Score: ${finalScore}`,
      canvas.width / 2 - 110,
      canvas.height / 2 + 20
    );

    // リスタートボタンの表示
    restartButton.style.display = 'block';
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤーの動き
  if (keys.right && player.x + player.width < canvas.width)
    player.x += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y + player.height < canvas.height)
    player.y += player.speed;

  // プレイヤーの描画
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 障害物の生成と更新
  if (frameCount % obstacleFrequency === 0) {
    generateObstacle();
  }
  updateObstacles();

  // ボーナスポイントの生成
  if (frameCount % 500 === 0) {
    generateBonusPoint();
  }

  // 障害物の描画
  ctx.fillStyle = 'red';
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // ボーナスポイントの描画
  ctx.fillStyle = 'pink';
  bonusPoints.forEach((bonus) => {
    ctx.fillRect(bonus.x, bonus.y, bonus.width, bonus.height);
  });

  // 衝突判定
  obstacles.forEach((obs) => {
    if (checkCollision(player, obs)) {
      gameOver = true;
    }
  });

  // ボーナスポイントの取得判定
  for (let i = 0; i < bonusPoints.length; i++) {
    if (checkCollision(player, bonusPoints[i])) {
      bonusScore += 100; // スコアに100ポイント加算
      bonusCount++; // ボーナスポイントの取得数を加算
      bonusPoints.splice(i, 1);
      i--;
    }
  }

  // スコアの更新と描画
  score++;
  scoreBoard.textContent = `Score: ${score} + Bonus: ${bonusCount} x 100`; // スコアボードの更新

  // 障害物生成頻度の調整
  if (frameCount % 600 === 0 && obstacleFrequency > 10) {
    // 10秒ごとに障害物生成頻度を増加
    obstacleFrequency -= 10; // 今の倍の速さで増加
  }

  frameCount++;
  requestAnimationFrame(gameLoop);
}

// ゲームリスタート関数
function restartGame() {
  // 初期状態にリセット
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height / 2 - 25;
  obstacles.length = 0; // 障害物をクリア
  bonusPoints.length = 0; // ボーナスポイントをクリア
  score = 0;
  bonusScore = 0;
  bonusCount = 0; // ボーナスカウントをリセット
  frameCount = 0;
  obstacleFrequency = initialObstacleFrequency;
  gameOver = false;
  restartButton.style.display = 'none';
  scoreBoard.textContent = `Score: 0 + Bonus: 0 x 100`;
  gameLoop();
}

// ゲーム開始
gameLoop();
