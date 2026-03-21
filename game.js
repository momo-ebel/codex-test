const descriptions = {
  star: 'Tap the glowing stars before they fade away. Quick rounds, fast taps, and a local high score challenge.',
  adventure: 'Guide Morris through a one-screen platform adventure with jumps, roaming enemies, and iPhone-friendly controls.',
};

const arena = document.getElementById('arena');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const startButton = document.getElementById('start-button');
const descriptionEl = document.getElementById('game-description');
const gameTabs = [...document.querySelectorAll('.game-tab')];
const panels = {
  star: document.getElementById('star-panel'),
  adventure: document.getElementById('adventure-panel'),
};
const jumpButton = document.getElementById('jump-button');
const restartButton = document.getElementById('restart-button');
const canvas = document.getElementById('adventure-canvas');
const ctx = canvas.getContext('2d');

const starGame = {
  duration: 30,
  spawnInterval: 700,
  starLifetime: 950,
  score: 0,
  timeLeft: 30,
  spawnTimer: 0,
  countdownTimer: 0,
  bestScore: Number(localStorage.getItem('star-catcher-best') || 0),
  active: false,
};

const adventureGame = {
  active: false,
  animationFrame: 0,
  score: 0,
  timeLeft: 45,
  bestScore: Number(localStorage.getItem('morris-adventure-best') || 0),
  lastTimestamp: 0,
  player: null,
  cameraX: 0,
  goalX: 0,
  status: 'ready',
  keys: { jump: false },
  touchHeld: false,
};

const level = {
  width: 1500,
  groundY: 490,
  platforms: [
    { x: 0, y: 490, width: 430, height: 70, color: '#65a30d' },
    { x: 500, y: 450, width: 160, height: 26, color: '#84cc16' },
    { x: 760, y: 400, width: 130, height: 24, color: '#a3e635' },
    { x: 960, y: 460, width: 180, height: 26, color: '#65a30d' },
    { x: 1220, y: 430, width: 190, height: 26, color: '#84cc16' },
  ],
  hazards: [
    { x: 440, y: 505, width: 42, height: 24 },
    { x: 895, y: 505, width: 48, height: 24 },
    { x: 1160, y: 505, width: 46, height: 24 },
  ],
  enemies: [
    { x: 570, y: 416, width: 38, height: 34, minX: 520, maxX: 618, speed: 62, dir: 1 },
    { x: 1010, y: 426, width: 38, height: 34, minX: 990, maxX: 1088, speed: 84, dir: -1 },
  ],
};

let currentGame = 'star';

function setMessage(text) {
  messageEl.textContent = text;
}

function setStatus(score, time, best) {
  scoreEl.textContent = String(score);
  timeEl.textContent = String(Math.max(0, Math.ceil(time)));
  bestEl.textContent = String(best);
}

function switchGame(nextGame) {
  currentGame = nextGame;
  gameTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.game === nextGame));
  Object.entries(panels).forEach(([name, panel]) => panel.classList.toggle('is-active', name === nextGame));
  descriptionEl.textContent = descriptions[nextGame];

  if (nextGame === 'star') {
    stopAdventure(false);
    startButton.disabled = false;
    startButton.textContent = starGame.active ? 'Playing…' : 'Start game';
    setStatus(starGame.score, starGame.timeLeft, starGame.bestScore);
    setMessage(starGame.active ? 'Catch every star you can before the timer ends!' : 'Press start to begin the countdown.');
  } else {
    stopStarGame(false);
    startButton.disabled = false;
    startButton.textContent = adventureGame.active ? 'Running…' : 'Start adventure';
    setStatus(adventureGame.score, adventureGame.timeLeft, adventureGame.bestScore);
    setMessage('Help Morris dodge paint-spirit enemies, clear spikes, and reach the studio door.');
    drawAdventure();
  }
}

function clearArena() {
  arena.replaceChildren();
}

function updateStarScore(nextScore) {
  starGame.score = nextScore;
  setStatus(starGame.score, starGame.timeLeft, starGame.bestScore);

  if (starGame.score > starGame.bestScore) {
    starGame.bestScore = starGame.score;
    localStorage.setItem('star-catcher-best', String(starGame.bestScore));
    setStatus(starGame.score, starGame.timeLeft, starGame.bestScore);
  }
}

function updateStarTime(nextTime) {
  starGame.timeLeft = nextTime;
  setStatus(starGame.score, starGame.timeLeft, starGame.bestScore);
}

function randomPosition() {
  const arenaRect = arena.getBoundingClientRect();
  const size = 64;
  return {
    left: Math.max(8, Math.random() * (arenaRect.width - size - 16)),
    top: Math.max(8, Math.random() * (arenaRect.height - size - 16)),
  };
}

function removeStar(star) {
  if (star.isConnected) {
    star.remove();
  }
}

function spawnStar() {
  if (!starGame.active || currentGame !== 'star') {
    return;
  }

  const star = document.createElement('button');
  star.type = 'button';
  star.className = 'star';
  star.setAttribute('aria-label', 'Catch star');

  const { left, top } = randomPosition();
  star.style.left = `${left}px`;
  star.style.top = `${top}px`;

  const timeoutId = window.setTimeout(() => removeStar(star), starGame.starLifetime);

  star.addEventListener('click', () => {
    window.clearTimeout(timeoutId);
    removeStar(star);
    updateStarScore(starGame.score + 1);
    setMessage('Nice catch! Keep going.');
  });

  arena.appendChild(star);
}

function stopStarGame(showMessage = true) {
  starGame.active = false;
  window.clearInterval(starGame.spawnTimer);
  window.clearInterval(starGame.countdownTimer);
  clearArena();

  if (currentGame === 'star') {
    startButton.disabled = false;
    startButton.textContent = 'Start game';
    if (showMessage) {
      setMessage(`Time's up! Final score: ${starGame.score}. Press start to play again.`);
    }
  }
}

function startStarGame() {
  stopAdventure(false);
  starGame.active = true;
  startButton.disabled = true;
  startButton.textContent = 'Playing…';
  updateStarScore(0);
  updateStarTime(starGame.duration);
  clearArena();
  setMessage('Catch every star you can before the timer ends!');

  spawnStar();
  starGame.spawnTimer = window.setInterval(spawnStar, starGame.spawnInterval);
  starGame.countdownTimer = window.setInterval(() => {
    updateStarTime(starGame.timeLeft - 1);

    if (starGame.timeLeft <= 0) {
      stopStarGame(true);
    }
  }, 1000);
}

function resetAdventureState() {
  adventureGame.score = 0;
  adventureGame.timeLeft = 45;
  adventureGame.status = 'running';
  adventureGame.lastTimestamp = 0;
  adventureGame.cameraX = 0;
  adventureGame.goalX = 1430;
  adventureGame.player = {
    x: 40,
    y: 410,
    width: 46,
    height: 78,
    vx: 142,
    vy: 0,
    onGround: false,
  };

  level.enemies.forEach((enemy, index) => {
    const startPositions = [570, 1010];
    enemy.x = startPositions[index];
    enemy.dir = index === 0 ? 1 : -1;
  });
}

function startAdventure() {
  stopStarGame(false);
  resetAdventureState();
  adventureGame.active = true;
  startButton.disabled = true;
  startButton.textContent = 'Running…';
  setStatus(adventureGame.score, adventureGame.timeLeft, adventureGame.bestScore);
  setMessage('Morris is on the move — jump over spikes and avoid the paint spirits!');
  window.cancelAnimationFrame(adventureGame.animationFrame);
  adventureGame.animationFrame = window.requestAnimationFrame(adventureLoop);
}

function stopAdventure(showMessage = true, customMessage = '') {
  adventureGame.active = false;
  window.cancelAnimationFrame(adventureGame.animationFrame);

  if (currentGame === 'adventure') {
    startButton.disabled = false;
    startButton.textContent = 'Start adventure';
    if (showMessage && customMessage) {
      setMessage(customMessage);
    }
  }
}

function finishAdventure(win) {
  const completionScore = win ? Math.max(1, Math.round(adventureGame.timeLeft * 10)) : 0;
  adventureGame.score = completionScore;

  if (completionScore > adventureGame.bestScore) {
    adventureGame.bestScore = completionScore;
    localStorage.setItem('morris-adventure-best', String(adventureGame.bestScore));
  }

  setStatus(adventureGame.score, adventureGame.timeLeft, adventureGame.bestScore);
  const message = win
    ? `Morris made it! Adventure score: ${completionScore}. Tap start to speedrun again.`
    : 'Morris got bumped back to the start. Tap start or restart level to try again.';
  stopAdventure(true, message);
  adventureGame.status = win ? 'won' : 'lost';
  drawAdventure();
}

function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function jump() {
  if (!adventureGame.active || !adventureGame.player.onGround) {
    return;
  }

  adventureGame.player.vy = -350;
  adventureGame.player.onGround = false;
}

function applyPhysics(delta) {
  const player = adventureGame.player;
  player.vy += 860 * delta;
  player.x += player.vx * delta;
  player.y += player.vy * delta;

  player.onGround = false;

  const surfaces = level.platforms.map((platform) => ({
    x: platform.x,
    y: platform.y,
    width: platform.width,
    height: platform.height,
  }));

  surfaces.forEach((surface) => {
    const previousBottom = player.y + player.height - player.vy * delta;
    const hitsTop = previousBottom <= surface.y + 8 && player.y + player.height >= surface.y;
    const withinX = player.x + player.width > surface.x && player.x < surface.x + surface.width;

    if (hitsTop && withinX) {
      player.y = surface.y - player.height;
      player.vy = 0;
      player.onGround = true;
    }
  });

  if (player.y > canvas.height + 100) {
    finishAdventure(false);
  }

  level.hazards.forEach((hazard) => {
    if (intersects(player, hazard)) {
      finishAdventure(false);
    }
  });

  level.enemies.forEach((enemy) => {
    enemy.x += enemy.speed * enemy.dir * delta;
    if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
      enemy.dir *= -1;
    }

    if (intersects(player, enemy)) {
      finishAdventure(false);
    }
  });

  if (player.x + player.width >= adventureGame.goalX) {
    finishAdventure(true);
  }

  adventureGame.cameraX = Math.min(Math.max(player.x - 130, 0), level.width - canvas.width);
}

function drawRoundedRect(x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

function drawMorris(x, y) {
  ctx.save();
  ctx.translate(x, y);

  drawRoundedRect(6, 48, 32, 30, 8, '#f8fafc');
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(6, 52, 10, 22);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(16, 52, 12, 22);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(28, 52, 10, 22);
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(16, 76);
  ctx.lineTo(12, 98);
  ctx.moveTo(28, 76);
  ctx.lineTo(33, 98);
  ctx.moveTo(6, 58);
  ctx.lineTo(-4, 74);
  ctx.moveTo(38, 58);
  ctx.lineTo(48, 74);
  ctx.stroke();

  ctx.fillStyle = '#f2c29b';
  ctx.beginPath();
  ctx.arc(22, 28, 19, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(3, 20);
  ctx.lineTo(14, 3);
  ctx.lineTo(32, 2);
  ctx.lineTo(42, 10);
  ctx.lineTo(39, 26);
  ctx.lineTo(4, 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(17, 4, 9, 11);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(9, 8, 8, 8);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(26, 7, 7, 8);

  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(15, 27, 2.2, 0, Math.PI * 2);
  ctx.arc(29, 27, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2.3;
  ctx.beginPath();
  ctx.moveTo(15, 35);
  ctx.quadraticCurveTo(22, 41, 29, 35);
  ctx.stroke();

  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(14, 33);
  ctx.lineTo(19, 31);
  ctx.moveTo(30, 33);
  ctx.lineTo(25, 31);
  ctx.stroke();

  ctx.restore();
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x - adventureGame.cameraX, enemy.y);
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.arc(19, 17, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fdf4ff';
  ctx.fillRect(8, 10, 6, 6);
  ctx.fillRect(24, 10, 6, 6);
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(19, 22);
  ctx.lineTo(12, 30);
  ctx.lineTo(26, 30);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawAdventure() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff55';
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(60 + i * 90 - adventureGame.cameraX * 0.12, 72 + (i % 2) * 26, 22, 0, Math.PI * 2);
    ctx.arc(84 + i * 90 - adventureGame.cameraX * 0.12, 60 + (i % 2) * 26, 18, 0, Math.PI * 2);
    ctx.arc(106 + i * 90 - adventureGame.cameraX * 0.12, 74 + (i % 2) * 26, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  level.platforms.forEach((platform) => {
    const drawX = platform.x - adventureGame.cameraX;
    drawRoundedRect(drawX, platform.y, platform.width, platform.height, 12, platform.color);
    ctx.fillStyle = '#3f6212';
    ctx.fillRect(drawX, platform.y + platform.height - 10, platform.width, 10);
  });

  level.hazards.forEach((hazard) => {
    const drawX = hazard.x - adventureGame.cameraX;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(drawX, hazard.y + hazard.height);
    ctx.lineTo(drawX + hazard.width / 2, hazard.y);
    ctx.lineTo(drawX + hazard.width, hazard.y + hazard.height);
    ctx.closePath();
    ctx.fill();
  });

  level.enemies.forEach(drawEnemy);

  const goalScreenX = adventureGame.goalX - adventureGame.cameraX;
  ctx.fillStyle = '#92400e';
  ctx.fillRect(goalScreenX, 340, 18, 150);
  drawRoundedRect(goalScreenX + 18, 350, 46, 80, 8, '#f5d0fe');
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(goalScreenX + 52, 390, 4, 0, Math.PI * 2);
  ctx.fill();

  if (adventureGame.player) {
    drawMorris(adventureGame.player.x - adventureGame.cameraX, adventureGame.player.y);
  }

  ctx.fillStyle = '#0f172a99';
  drawRoundedRect(12, 12, 160, 52, 14, '#0f172acc');
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px Inter, system-ui, sans-serif';
  ctx.fillText(`Morris: ${adventureGame.score}`, 24, 35);
  ctx.fillText(`Time: ${Math.ceil(adventureGame.timeLeft)}`, 24, 55);

  if (!adventureGame.active) {
    drawRoundedRect(38, 214, 314, 110, 20, '#0f172ad9');
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px Inter, system-ui, sans-serif';
    ctx.fillText('Morris Adventure', 86, 252);
    ctx.font = '15px Inter, system-ui, sans-serif';
    const overlayText = adventureGame.status === 'won'
      ? 'Studio door reached! Start again for a faster run.'
      : 'Tap start to guide Morris through the level.';
    ctx.fillText(overlayText, 58, 286);
  }
}

function adventureLoop(timestamp) {
  if (!adventureGame.active) {
    return;
  }

  if (!adventureGame.lastTimestamp) {
    adventureGame.lastTimestamp = timestamp;
  }

  const delta = Math.min((timestamp - adventureGame.lastTimestamp) / 1000, 0.032);
  adventureGame.lastTimestamp = timestamp;
  adventureGame.timeLeft -= delta;

  if (adventureGame.timeLeft <= 0) {
    adventureGame.timeLeft = 0;
    finishAdventure(false);
    return;
  }

  applyPhysics(delta);
  setStatus(adventureGame.score, adventureGame.timeLeft, adventureGame.bestScore);
  drawAdventure();
  adventureGame.animationFrame = window.requestAnimationFrame(adventureLoop);
}

startButton.addEventListener('click', () => {
  if (currentGame === 'star') {
    startStarGame();
  } else {
    startAdventure();
  }
});

gameTabs.forEach((tab) => tab.addEventListener('click', () => switchGame(tab.dataset.game)));

jumpButton.addEventListener('click', jump);
restartButton.addEventListener('click', () => {
  switchGame('adventure');
  startAdventure();
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault();
    jump();
  }
});

canvas.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  jump();
});

setStatus(starGame.score, starGame.timeLeft, starGame.bestScore);
setMessage('Press start to begin the countdown.');
drawAdventure();
