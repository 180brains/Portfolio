// Game Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 30;
const MAX_OBSTACLES = 10;
const OBSTACLE_SPEED = 5;
const SCORE_INCREMENT = 1;

// Game State
let playerX = 0;
let playerY = GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Game Elements
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Handle player movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && playerY > 0) {
        playerY -= 10;
    } else if (event.key === 'ArrowDown' && playerY < GAME_HEIGHT - PLAYER_HEIGHT) {
        playerY += 10;
    }
});

// Game loop
function gameLoop() {
    if (!isGameOver) {
        update();
        render();
    }

    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Generate obstacles
    if (obstacles.length < MAX_OBSTACLES) {
        generateObstacle();
    }

    // Move obstacles
    obstacles.forEach((obstacle) => {
        obstacle.x -= OBSTACLE_SPEED;

        // Check for collision with player
        if (isColliding(obstacle, playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT)) {
            gameOver();
        }
    });

    // Remove off-screen obstacles
    obstacles = obstacles.filter((obstacle) => obstacle.x + OBSTACLE_WIDTH > 0);

    // Update score
    score += SCORE_INCREMENT;
}

// Render game
function render() {
    // Clear canvas
    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw player
    context.fillStyle = '#ff0000';
    context.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw obstacles
    obstacles.forEach((obstacle) => {
        context.fillStyle = '#00ff00';
        context.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    });

    // Draw score
    scoreElement.textContent = 'Score: ' + score;

    // Game over screen
    if (isGameOver) {
        gameOverElement.style.display = 'block';
    }
}

// Generate random obstacle
function generateObstacle() {
    const minY = 0;
    const maxY = GAME_HEIGHT - OBSTACLE_HEIGHT;
    const y = Math.floor(Math.random() * (maxY - minY + 1) + minY);
    const obstacle = { x: GAME_WIDTH, y };
    obstacles.push(obstacle);
}

// Check collision between two rectangles
function isColliding(obstacle, x, y, width, height) {
    return (
        obstacle.x < x + width &&
        obstacle.x + OBSTACLE_WIDTH > x &&
        obstacle.y < y + height &&
        obstacle.y + OBSTACLE_HEIGHT > y
    );
}

// Game over
function gameOver() {
    isGameOver = true;
}

// Start the game
gameLoop();
