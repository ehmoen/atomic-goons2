import {Game} from "./Game.js";
import Timer from "./engine/Timer.js";

export const GameState = {
    START: 0,
    LEVEL1: 1,
    LEVEL2: 2,
    GAME_OVER: 3
};

let currentState = GameState.START;

//
// Game initialization
//
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas, ctx);
game.setState(currentState); // set initial state

//
// Keyboard handler for changing states (for DEBUG)
//
// window.addEventListener("keydown", (e) => {
//     if (e.key === "Enter" && currentState === GameState.START) {
//         currentState = GameState.LEVEL1;
//         game.setState(currentState);
//         console.log("Game started", currentState);
//     } else if (e.key === "1") {
//         currentState = GameState.LEVEL1;
//         game.setState(currentState);
//         console.log("1Level 1");
//     } else if (e.key === "2") {
//         currentState = GameState.LEVEL2;
//         game.setState(currentState);
//         console.log("Level 2");
//     } else if (e.key === "g") {
//         currentState = GameState.GAME_OVER;
//         game.setState(currentState);
//         console.log("Game Over");
//     }
// });

//
// Start game
//
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
    document.getElementById('gameStart').style.display = "none";
    playGame();
});

//
// Play game
//
function playGame() {
    game.reset();
    currentState = GameState.LEVEL1;
    game.setState(currentState);
}

// document.getElementById("playBtn").addEventListener("click", () => {
//     document.getElementById('gameStart').style.display = "none";
//     playGame();
// });

//
// Restart game
//
document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById('gameOver').style.display = "none";
    playGame();
});

document.getElementById("quitBtn").addEventListener("click", () => {
    document.getElementById('gameOver').style.display = "none";
    document.getElementById('gameStart').style.display = "flex";
});


//
// Timer
//
const timer = new Timer(1 / 60);
timer.update = function update(deltaTime) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
}

timer.start();