export class GameStateManager {
    constructor(game) {
        this.game = game;
        this.gameState = "menu"; // menu, play, pause, gameover
        this.startButton = document.getElementById("startButton");
        this.startButton.addEventListener("click", () => {
            this.startGame();
        });
    }

    startGame() {
        this.game.gameOver = false;
        this.game.score = 0;
        this.game.gameTime = 0;
        this.game.enemies = [];
        this.game.ammo = this.game.maxAmmo;
        this.game.speed = 1;
        this.game.start();
    }
    
    gameOver() {
        this.gameState = "gameover";
        this.game.gameOver = true;
        this.game.sound.songGoonsInAction.pause();
        this.game.sound.songMainTheme.play();
    }
     
    pauseGame() {
        this.gameState = "pause";
        this.game.pause();
    }
        
    resumeGame() {
        this.gameState = "play";
        this.game.resume();
    }
}