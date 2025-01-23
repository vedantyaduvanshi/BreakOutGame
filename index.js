const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const levelDisplay = document.querySelector('#level');
const gameMessage = document.getElementById('game-message');
const endMessage = document.getElementById('end-message');
const playPauseButton = document.getElementById('play-pause');
const playAgainButton = document.getElementById('play-again');
const difficultySelector = document.getElementById('difficulty');

const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

let xDirection = -2;
let yDirection = 2;
let timerId;
let interval = 30;

let isPaused = false;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let score = 0;
let level = 1;

// Block class
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

// All blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
];

// Add blocks
function addBlocks() {
  blocks.forEach(block => {
    const blockElement = document.createElement('div');
    blockElement.classList.add('block');
    blockElement.style.left = block.bottomLeft[0] + 'px';
    blockElement.style.bottom = block.bottomLeft[1] + 'px';
    grid.appendChild(blockElement);
  });
}
addBlocks();

// Add user
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Move user
function moveUser(e) {
  if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
    currentPosition[0] -= 10;
    drawUser();
  } else if (e.key === 'ArrowRight' && currentPosition[0] < boardWidth - blockWidth) {
    currentPosition[0] += 10;
    drawUser();
  }
}
document.addEventListener('keydown', moveUser);

// Draw user
function drawUser() {
  user.style.left = currentPosition[0] + 'px';
  user.style.bottom = currentPosition[1] + 'px';
}

// Draw ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px';
  ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// Move ball
function moveBall() {
  if (!isPaused) {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
  }
}
timerId = setInterval(moveBall, interval);

// Check for collisions
function checkForCollisions() {
  // Block collisions
  blocks.forEach((block, index) => {
    if (
      ballCurrentPosition[0] > block.bottomLeft[0] &&
      ballCurrentPosition[0] < block.bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
      ballCurrentPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[index].remove();
      blocks.splice(index, 1);
      changeDirection();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      if (blocks.length === 0) nextLevel();
    }
  });

  // Wall collisions
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= boardHeight - ballDiameter
  ) {
    changeDirection();
  }

  // User collisions
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  // Game over
  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId);
    showGameOver('Game Over!');
  }
}

// Show game over message
function showGameOver(message) {
  gameMessage.style.display = 'block';
  endMessage.textContent = message;
  document.removeEventListener('keydown', moveUser);
}

// Play again button
playAgainButton.addEventListener('click', () => {
  location.reload();
});

// Change ball direction
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
  } else if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
  } else if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
  } else if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
  }
}

// Pause/Play button
playPauseButton.addEventListener('click', () => {
  isPaused = !isPaused;
  playPauseButton.textContent = isPaused ? 'Play' : 'Pause';
});

// Change difficulty
difficultySelector.addEventListener('change', (e) => {
  clearInterval(timerId);
  interval = parseInt(e.target.value);
  timerId = setInterval(moveBall, interval);
});

// Level up
function nextLevel() {
  clearInterval(timerId);
  level++;
  levelDisplay.textContent = `Level: ${level}`;
  xDirection *= 1.2;
  yDirection *= 1.2;
  addBlocks();
  timerId = setInterval(moveBall, interval);
}
