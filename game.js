const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
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
const initialObstacleFrequency = 30; // 初期の障害物生成頻度（今の倍の速さ）
let obstacleFrequency = initialObstacleFrequency;
let frameCount = 0;

// スコアの設定
let score = 0;
let gameOver = false;

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
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

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

  // 障害物の描画
  ctx.fillStyle = 'red';
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });

  // 衝突判定
  obstacles.forEach((obs) => {
    if (checkCollision(player, obs)) {
      gameOver = true;
    }
  });

  // スコアの更新と描画
  score++;
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);

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
  obstacleFrequency = initialObstacleFrequency;
  frameCount = 0;
  score = 0;
  gameOver = false;
  restartButton.style.display = 'none'; // リスタートボタンを隠す

  // ゲームループの再開
  requestAnimationFrame(gameLoop);
}

// ゲームループの開始
gameLoop();
