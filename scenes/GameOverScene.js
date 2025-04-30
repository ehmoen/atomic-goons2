import Scene from "../engine/Scene.js";
import Level1Scene from "./Level1Scene.js";
import {drawStars} from "../engine/utils.js";

export default class GameOverScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
    }

    onEnter() {
        // const gameOver = document.getElementById("gameOver");
        // gameOver.style.display = "block";
        // drawStars(gameOver, 300);
            
        this.sceneManager.engine.audio.playMusic("mainTheme", true);

    }

    update(deltaTime) {
        if (this.sceneManager.engine.input.wasPressedOnce("Enter")) {
            this.sceneManager.changeScene(new Level1Scene(this.sceneManager));
        }
    }

    draw(ctx) {
        const backgroundImage = new Image();
        backgroundImage.src = "./assets/sprites/atomic-hero.png";
        
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.drawImage(backgroundImage, 
            ctx.canvas.width / 2 - backgroundImage.width, 
            ctx.canvas.height / 2 - backgroundImage.height / 2 , 
            ctx.canvas.width / 2, 
            ctx.canvas.height / 2);
        
        ctx.fillStyle = "white";
        ctx.font = "250% 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 10);
        ctx.fillText("Press Enter to Restart", ctx.canvas.width / 2, ctx.canvas.height / 5);
    }

    onExit() {

    }
}
