import Level1Scene from "./Level1Scene.js";
import Scene from "../engine/Scene.js";
import {drawStars} from "../engine/utils.js";
import StartScene from "./StartScene.js";

export default class IntroScene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
    }

    onEnter() {
        console.log("Game-intro started");
        //this.sceneManager.engine.audio.playMusic("mainTheme", true);
    }

    update(deltaTime) {
        
        if (this.sceneManager.engine.input.wasPressedOnce("Enter")) {
            this.sceneManager.changeScene(new StartScene(this.sceneManager));
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
        document.getElementById("gameIntro").style.display = "none";
    }
    

}
