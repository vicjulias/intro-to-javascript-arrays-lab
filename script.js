const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const scoreDisplay = document.getElementById('score');

let snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
let food = generateFood();
let direction = 'right';
let speed = 120;
let gameInterval;
let isPaused = false;
let score = 0;

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = 'pink';
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 2; 
        ctx.strokeRect(segment.x, segment.y, 10, 10);
        ctx.fillStyle = 'pink';
        ctx.fillRect(segment.x, segment.y, 10, 10);
    });
}

function drawFood() {
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'darkgreen';
    ctx.lineWidth = 2;
    ctx.strokeRect(food.x, food.y, 10, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y -= 10;
            break;
        case 'down':
            head.y += 10;
            break;
        case 'left':
            head.x -= 10;
            break;
        case 'right':
            head.x += 10;
            break;
    }

    snake.unshift(head);
    snake.pop(); // Remove the tail segment
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }

    // Self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function eatFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        snake.push({ ...snake[snake.length - 1] }); // Grow the snake
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        food = generateFood();
        if (snake.length % 8 === 0 && speed > 30) {
            clearInterval(gameInterval);
            speed -= 10;
            gameInterval = setInterval(gameLoop, speed);
        }
    }
}

function generateFood() {
    let newFood;
    while (!newFood || isFoodOnSnake(newFood)) {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
            y: Math.floor(Math.random() * (canvas.height / 10)) * 10
        };
    }
    return newFood;
}

function isFoodOnSnake(foodPosition) {
    return snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}

function gameLoop() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake();
        if (checkCollision()) {
            gameOver();
            return;
        }
        eatFood();
        drawFood();
        drawSnake();
    }
}

function startGame() {
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    food = generateFood();
    direction = 'right';
    speed = 120;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
    isPaused = false;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    resumeButton.style.display = 'none';
}

function pauseGame() {
    isPaused = true;
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'inline-block';
}

function resumeGame() {
    isPaused = false;
    pauseButton.style.display = 'inline-block';
    resumeButton.style.display = 'none';
}

function gameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'red';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    startButton.style.display = 'inline-block';
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'none';
}

// Function to update the score
function updateScore(points) {
  score += points;
  console.log("Current Score:", score); // For debugging
  checkHighScore(); // Call the localStorage function after updating the score
}

// Function to handle local storage of the high score
function checkHighScore() {
  const highScore = localStorage.getItem('highScore') || 0;
  const highScoreNumber = parseInt(highScore, 10); // Make sure to parse the high score as an integer - make sure its a number

  if (score > highScoreNumber) {
    localStorage.setItem('highScore', score);
    alert(`New High Score: ${score}`);
  }
}


document.addEventListener('keydown', (event) => {
    if (!isPaused) {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    }
});

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);


drawFood();
drawSnake();
