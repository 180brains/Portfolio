// Get the canvas element
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player variables
var playerSize = 30;
var playerX = canvas.width / 2 - playerSize / 2;
var playerY = canvas.height - playerSize - 10;
var playerSpeed = 5;
var moveLeft = false;
var moveRight = false;
var playerLives = 3;

// Bullet variables
var bulletSize = 10;
var bullets = [];
var bulletSpeed = 5;

// Enemy variables
var enemySize = 20;
var enemies = [];
var enemySpeed = 2;
var enemySpawnInterval = 1000; // in milliseconds
var lastEnemySpawnTime = 0;

// Powerup variables
var powerupSize = 20;
var powerups = [];
var powerupSpeed = 2;
var powerupSpawnInterval = 5000; // in milliseconds
var lastPowerupSpawnTime = 0;

// Game variables
var score = 0;

// Event listeners for keyboard controls
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    moveLeft = true;
  } else if (event.key === "ArrowRight") {
    moveRight = true;
  } else if (event.key === " ") {
    shootBullet();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    moveLeft = false;
  } else if (event.key === "ArrowRight") {
    moveRight = false;
  }
});

// Event listeners for touch controls
canvas.addEventListener("touchstart", function (event) {
  var touchX = event.touches[0].clientX;

  if (touchX < playerX) {
    moveLeft = true;
  } else if (touchX > playerX + playerSize) {
    moveRight = true;
  }

  shootBullet();
});

canvas.addEventListener("touchend", function (event) {
  moveLeft = false;
  moveRight = false;
});

// Update player position based on movement variables
function updatePlayerPosition() {
  if (moveLeft && playerX > 0) {
    playerX -= playerSpeed;
  } else if (moveRight && playerX < canvas.width - playerSize) {
    playerX += playerSpeed;
  }
}

// Shoot a bullet
function shootBullet() {
  var bullet = {
    x: playerX + playerSize / 2 - bulletSize / 2,
    y: playerY - bulletSize,
  };
  bullets.push(bullet);
}

// Generate enemies
function generateEnemies() {
  var enemy = {
    x: Math.random() * (canvas.width - enemySize),
    y: -enemySize,
    type: Math.floor(Math.random() * 2) + 1, // Randomly assign enemy type 1 or 2
  };
  enemies.push(enemy);
}

// Generate powerups
function generatePowerups() {
  var powerup = {
    x: Math.random() * (canvas.width - powerupSize),
    y: -powerupSize,
  };
  powerups.push(powerup);
}

// Update bullet positions
function updateBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    bullet.y -= bulletSpeed;

    // Remove bullets that go off-screen
    if (bullet.y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Update enemy positions
function updateEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    enemy.y += enemySpeed;

    // Remove enemies that go off-screen
    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      i--;
    }
  }
}

// Update powerup positions
function updatePowerups() {
  for (var i = 0; i < powerups.length; i++) {
    var powerup = powerups[i];
    powerup.y += powerupSpeed;

    // Remove powerups that go off-screen
    if (powerup.y > canvas.height) {
      powerups.splice(i, 1);
      i--;
    }
  }
}

// Check for collisions between bullets and enemies
function checkCollisions() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];

    for (var j = 0; j < enemies.length; j++) {
      var enemy = enemies[j];

      // Collision detection logic
      if (
        bullet.x < enemy.x + enemySize &&
        bullet.x + bulletSize > enemy.x &&
        bullet.y < enemy.y + enemySize &&
        bullet.y + bulletSize > enemy.y
      ) {
        // Remove collided bullet and enemy
        bullets.splice(i, 1);
        i--;
        enemies.splice(j, 1);

        // Increment score
        score++;
        break; // Exit the inner loop since the bullet can only collide with one enemy
      }
    }
  }

  // Check for collisions between player and enemies
  for (var j = 0; j < enemies.length; j++) {
    var enemy = enemies[j];

    // Collision detection logic
    if (
      playerX < enemy.x + enemySize &&
      playerX + playerSize > enemy.x &&
      playerY < enemy.y + enemySize &&
      playerY + playerSize > enemy.y
    ) {
      // Remove collided enemy
      enemies.splice(j, 1);

      // Decrement player lives
      playerLives--;

      // Check if player has no more lives
      if (playerLives === 0) {
        endGame();
      }

      break; // Exit the loop since player can only collide with one enemy at a time
    }
  }

  // Check for collisions between player and powerups
  for (var j = 0; j < powerups.length; j++) {
    var powerup = powerups[j];

    // Collision detection logic
    if (
      playerX < powerup.x + powerupSize &&
      playerX + playerSize > powerup.x &&
      playerY < powerup.y + powerupSize &&
      playerY + playerSize > powerup.y
    ) {
      // Remove collided powerup
      powerups.splice(j, 1);

      // Implement powerup effect (for example, increase player speed)
      playerSpeed += 2;

      break; // Exit the loop since player can only collide with one powerup at a time
    }
  }
}

// Draw the game elements on the canvas
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX, playerY, playerSize, playerSize);

  // Draw the bullets
  ctx.fillStyle = "red";
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    ctx.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
  }

  // Draw the enemies
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    ctx.fillStyle = enemy.type === 1 ? "green" : "purple";
    ctx.fillRect(enemy.x, enemy.y, enemySize, enemySize);
  }

  // Draw the powerups
  ctx.fillStyle = "yellow";
  for (var i = 0; i < powerups.length; i++) {
    var powerup = powerups[i];
    ctx.fillRect(powerup.x, powerup.y, powerupSize, powerupSize);
  }

  // Draw the score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Draw the lives
  ctx.fillStyle = "black";
  ctx.fillText("Lives: " + playerLives, 10, 60);
}

// Function to update the game state
function update() {
  updatePlayerPosition();
  updateBullets();
  updateEnemies();
  updatePowerups();
  checkCollisions();

  draw();

  // Call the update function again
  requestAnimationFrame(update);
}

// Function to spawn enemies at regular intervals
function spawnEnemies() {
  var currentTime = Date.now();
  if (currentTime - lastEnemySpawnTime > enemySpawnInterval) {
    generateEnemies();
    lastEnemySpawnTime = currentTime;
  }

  // Call the spawnEnemies function again
  requestAnimationFrame(spawnEnemies);
}

// Function to spawn powerups at regular intervals
function spawnPowerups() {
  var currentTime = Date.now();
  if (currentTime - lastPowerupSpawnTime > powerupSpawnInterval) {
    generatePowerups();
    lastPowerupSpawnTime = currentTime;
  }

  // Call the spawnPowerups function again
  requestAnimationFrame(spawnPowerups);
}

// Function to end the game
function endGame() {
  alert("Game Over! Final Score: " + score);
  location.reload(); // Reload the page to restart the game
}

// Start the game
update();
spawnEnemies();
spawnPowerups();
