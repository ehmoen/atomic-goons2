import InputHandler from "./InputHandler.js";
import SceneManager from "./SceneManager.js";
import UIHandler from "./UIHandler.js";
import AudioManager from "./AudioManager.js";

export default class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.width = canvas.width;
        this.height = canvas.height;
        
        this.sceneManager = new SceneManager(this);
        
        this.input = new InputHandler();
        this.input.listenForEvents();
        
        this.ui = new UIHandler(this);
        
        this.audio = new AudioManager();
        
        
        this.lastTime = 0;
        this.deltaTime = 0;
    }

    start(initialScene) {
        this.input.listenForEvents();
        this.sceneManager.changeScene(initialScene);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(this.deltaTime);
        this.draw(this.ctx);

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        //this.input.update && this.input.update(deltaTime); // if you later add gamepad support etc.
        this.sceneManager.update(deltaTime);
        this.ui.update(deltaTime);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sceneManager.draw(ctx);
        this.ui.draw(ctx);
    }
}
