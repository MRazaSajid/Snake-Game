
// Initial direction — snake is stationary at start
let inputDir = { x: 0, y: 0 };

// Load sound effects
const foodSound = new Audio('../sounds/food.mp3.mp3');        // Played when food is eaten
const gameOverSound = new Audio('../sounds/gameover.mp3.mp3'); // Played on collision (game over)
const moveSound = new Audio('../sounds/move.mp3.mp3');         // Played when snake changes direction
const musicSound = new Audio('../sounds/music.mp3.mp3');       // Background music

// Game speed (frames per second)
let speed = 10;

// Current score
let score = 0;

// Time tracking for frame control
let lastPaintTime = 0;

// Snake body array, initialized with 1 segment (head)
let snakeArr = [{ x: 13, y: 15 }];

// Initial food position
let food = { x: 6, y: 7 };


// The main game loop function
function main(ctime) {
    // Schedule the next frame
    window.requestAnimationFrame(main);

    // Control the game speed — skip frames if needed
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;

    // Update time tracker
    lastPaintTime = ctime;

    // Play background music if not already playing
    if (musicSound.paused) {
        musicSound.play();
    }

    // Run the main game logic
    gameEngine();
}


// Check if snake hits wall or itself
function isCollide(snake) {
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true; // Collision with own body
        }
    }

    // Check wall collision
    return (
        snake[0].x >= 18 || snake[0].x <= 0 ||
        snake[0].y >= 18 || snake[0].y <= 0
    );
}


function gameEngine() {
    // Game over logic if collision happens
    if (isCollide(snakeArr)) {
        gameOverSound.play();              // Play death sound
        musicSound.pause();                // Stop background music
        inputDir = { x: 0, y: 0 };         // Stop movement
        alert("Hahaha Game Over. Press any key to restart.");
        snakeArr = [{ x: 13, y: 15 }];     // Reset snake
        musicSound.play();                 // Restart music
        score = 0;                         // Reset score
        document.getElementById('scoreBox').innerHTML = "Score: " + score;
    }

    // If snake eats the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();          // Play food eating sound
        score++;                   // Increase score

        // Update high score if beaten
        if (score > highScoreVal) {
            highScoreVal = score;
            localStorage.setItem("highScore", JSON.stringify(highScoreVal));
            document.getElementById('highscoreBox').innerHTML = "High Score: " + highScoreVal;
        }

        // Update score display
        document.getElementById('scoreBox').innerHTML = "Score: " + score;

        // Grow the snake by adding a new head
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // Reposition food randomly on board
        let a = 2, b = 16;
        food = {
            x: Math.floor(a + (b - a) * Math.random()),
            y: Math.floor(a + (b - a) * Math.random())
        };
    }

    // Move the snake — shift body forward
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] }; // Copy position from previous segment
    }

    // Move head in current direction
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Draw everything on board
    const board = document.getElementById('board');
    board.innerHTML = ""; // Clear previous frame

    // Render each part of the snake
    snakeArr.forEach((e, i) => {
        let element = document.createElement('div');
        element.style.gridRowStart = e.y;
        element.style.gridColumnStart = e.x;
        element.classList.add(i === 0 ? 'head' : 'snake'); // Head or body
        board.appendChild(element);
    });

    // Render food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}


// Fetch high score from browser local storage
let highScore = localStorage.getItem("highScore");
let highScoreVal = highScore ? JSON.parse(highScore) : 0;

// Show the high score
document.getElementById('highscoreBox').innerHTML = "High Score: " + highScoreVal;


// Start the game loop
window.requestAnimationFrame(main);


// Event listener for arrow key input
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 }; // Start moving down by default on key press
    moveSound.play();         // Play movement sound

    // Update direction based on key pressed
    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
    }
});


