// Game variables
let canvas, ctx;
let player, obstacles;
let score, isGameOver;

// Initialize the game
function init() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");
    player = new Player();
    obstacles = [];
    score = 0;
    isGameOver = false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.7;

    // Event listener to handle player jump
    canvas.addEventListener("click", () => {
        if (!isGameOver) {
            player.jump();
        } else {
            resetGame();
        }
    });

    spawnObstacle();

    // Start the game loop
    gameLoop();
}

// Reset the game
function resetGame() {
    obstacles = [];
    score = 0;
    isGameOver = false;
    player.reset();
    spawnObstacle();
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player
    player.update();
    player.draw();

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw();

        // Check for collision with player
        if (player.checkCollision(obstacles[i])) {
            endGame();
            return;
        }

        // Remove obstacles that have moved off the screen
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Increment score
    score++;

    // Display score
    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(`Score: ${score}`, 20, 40);

    // Spawn new obstacles
    if (score % 100 === 0) {
        spawnObstacle();
    }

    // Request animation frame
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// End the game
function endGame() {
    isGameOver = true;

    // Display game over message
    ctx.font = "48px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);

    // Display final score
    ctx.font = "24px Arial";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 90, canvas.height / 2 + 40);
}

// Spawn a new obstacle
function spawnObstacle() {
    const obstacleHeight = Math.random() * (canvas.height * 0.4 - 50) + 50; // Random obstacle height between 50 and 40% of canvas height
    const obstacle = new Obstacle(obstacleHeight);
    obstacles.push(obstacle);
}

// Player class
class Player {
    constructor() {
        this.x = 50;
        this.y = canvas.height / 2;
        this.width = 50;
        this.height = 50;
        this.dy = 0;
        this.gravity = 1;
        this.jumpForce = 15;
        this.jumpsRemaining = 2; // Number of jumps remaining
    }

    // Update player position
    update() {
        this.dy += this.gravity;
        this.y += this.dy;

        // Prevent player from falling off the screen
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.dy = 0;
            this.jumpsRemaining = 2; // Reset jumps when touching the ground
        }
    }

    // Draw player
    draw() {
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Player jump
    jump() {
        if (this.jumpsRemaining > 0) {
            this.dy = -this.jumpForce;
            this.jumpsRemaining--;
        }
    }

    // Check collision with obstacle
    checkCollision(obstacle) {
        const playerLeft = this.x;
        const playerRight = this.x + this.width;
        const playerTop = this.y;
        const playerBottom = this.y + this.height;

        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;

        return (
            playerLeft < obstacleRight &&
            playerRight > obstacleLeft &&
            playerTop < obstacleBottom &&
            playerBottom > obstacleTop
        );
    }

    // Reset player position
    reset() {
        this.y = canvas.height / 2;
        this.dy = 0;
        this.jumpsRemaining = 2; // Reset jumps
    }
}

// Obstacle class
class Obstacle {
    constructor(height) {
        this.x = canvas.width;
        this.y = canvas.height - height;
        this.width = 40;
        this.height = height;
        this.dx = 5;
    }

    // Update obstacle position
    update() {
        this.x -= this.dx;
    }

    // Draw obstacle
    draw() {
        ctx.fillStyle = "#0f0";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Initialize the game when the page loads
window.addEventListener("load", init);
