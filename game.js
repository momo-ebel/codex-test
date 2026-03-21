const GAME_DURATION = 30;
const SPAWN_INTERVAL = 700;
const STAR_LIFETIME = 950;

const arena = document.getElementById('arena');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const messageEl = document.getElementById('message');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = GAME_DURATION;
let spawnTimer;
let countdownTimer;
let bestScore = Number(localStorage.getItem('star-catcher-best') || 0);
let activeGame = false;

bestEl.textContent = String(bestScore);

function setMessage(text) {
  messageEl.textContent = text;
}

function clearArena() {
  arena.replaceChildren();
}

function updateScore(nextScore) {
  score = nextScore;
  scoreEl.textContent = String(score);

  if (score > bestScore) {
    bestScore = score;
    bestEl.textContent = String(bestScore);
    localStorage.setItem('star-catcher-best', String(bestScore));
  }
}

function updateTime(nextTime) {
  timeLeft = nextTime;
  timeEl.textContent = String(timeLeft);
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
  if (!activeGame) {
    return;
  }

  const star = document.createElement('button');
  star.type = 'button';
  star.className = 'star';
  star.setAttribute('aria-label', 'Catch star');

  const { left, top } = randomPosition();
  star.style.left = `${left}px`;
  star.style.top = `${top}px`;

  const timeoutId = window.setTimeout(() => removeStar(star), STAR_LIFETIME);

  star.addEventListener('click', () => {
    window.clearTimeout(timeoutId);
    removeStar(star);
    updateScore(score + 1);
    setMessage('Nice catch! Keep going.');
  });

  arena.appendChild(star);
}

function stopGame() {
  activeGame = false;
  window.clearInterval(spawnTimer);
  window.clearInterval(countdownTimer);
  clearArena();
  startButton.disabled = false;
  setMessage(`Time's up! Final score: ${score}. Press start to play again.`);
}

function startGame() {
  activeGame = true;
  startButton.disabled = true;
  updateScore(0);
  updateTime(GAME_DURATION);
  clearArena();
  setMessage('Catch every star you can before the timer ends!');

  spawnStar();
  spawnTimer = window.setInterval(spawnStar, SPAWN_INTERVAL);
  countdownTimer = window.setInterval(() => {
    updateTime(timeLeft - 1);

    if (timeLeft <= 0) {
      stopGame();
    }
  }, 1000);
}

startButton.addEventListener('click', startGame);
