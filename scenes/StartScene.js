// StartScene.js
import Level1Scene from "./Level1Scene.js";
import Scene from "../engine/Scene.js";
import {drawStars} from "../engine/utils.js";

export default class StartScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
    }

    onEnter() {
        const gameStart = document.getElementById("gameStart");
        gameStart.style.display = "block";
        drawStars(gameStart, 300);
        console.log("Game started");
        this.sceneManager.engine.audio.playMusic("mainTheme", true);
    }

    update(deltaTime) {
        
        if (this.sceneManager.engine.input.wasPressedOnce("Enter")) {
            this.sceneManager.changeScene(new Level1Scene(this.sceneManager));
        }
    }

    draw(ctx) {
        // ctx.fillStyle = "red";
        // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //
        // ctx.fillStyle = "blue";
        // ctx.font = "48px Arial";
        // ctx.textAlign = "center";
        // ctx.fillText("Press Enter to Start", ctx.canvas.width / 2, ctx.canvas.height / 2);


    }

    onExit() {
        document.getElementById("gameStart").style.display = "none";
        //this.sceneManager.engine.audio.stopMusic(1000);
    }
    

}
