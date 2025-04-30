export default class SceneManager {
    constructor(engine) {
        this.engine = engine;
        this.input = engine.input;
        this.audio = engine.audio;
        this.currentScene = null;
    }

    changeScene(newScene) {
        if (this.currentScene && this.currentScene.onExit) {
            this.currentScene.onExit(); // clean up previous scene
        }

        this.currentScene = newScene;

        if (this.currentScene && this.currentScene.onEnter) {
            this.currentScene.onEnter(); // setup new scene
        }
    }

    update(deltaTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime);
        }
    }

    draw(ctx) {
        if (this.currentScene && this.currentScene.draw) {
            this.currentScene.draw(ctx);
        }
    }
}

//
// export class SceneManager {
//     constructor(input) {
//         this.input = input;
//         this.currentScene = null;
//         this.nextScene = null;
//         this.isTransitioning = false;
//         this.fadeOpacity = 0;
//         this.fadeSpeed = 0.002;
//     }
//
//     changeScene(newScene) {
//         this.nextScene = newScene;
//         this.isTransitioning = true;
//         this.fadeOpacity = 0;
//     }
//
//     update(deltaTime) {
//         if (this.isTransitioning) {
//             this.fadeOpacity += this.fadeSpeed;
//             if (this.fadeOpacity >= 1) {
//                 if (this.currentScene && this.currentScene.onExit) {
//                     this.currentScene.onExit();
//                 }
//                 this.currentScene = this.nextScene;
//                 this.nextScene = null;
//                 if (this.currentScene && this.currentScene.onEnter) {
//                     this.currentScene.onEnter();
//                 }
//             }
//         } else if (this.fadeOpacity > 0) {
//             this.fadeOpacity -= this.fadeSpeed;
//         }
//
//         if (this.currentScene && !this.isTransitioning) {
//             this.currentScene.update(deltaTime);
//         }
//     }
//
//     draw(ctx) {
//         if (this.currentScene) {
//             this.currentScene.draw(ctx);
//         }
//
//         if (this.fadeOpacity > 0) {
//             ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeOpacity})`;
//             ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//         }
//     }
// }







// export class SceneManager {
//     constructor() {
//         this.currentScene = null;
//         this.nextScene = null;
//         this.isTransitioning = false;
//         this.fadeOpacity = 0;
//         this.fadeSpeed = 0.02; // adjust for faster/slower fades
//     }
//
//     changeScene(newScene) {
//         this.nextScene = newScene;
//         this.isTransitioning = true;
//         this.fadeOpacity = 0;
//     }
//
//     update(deltaTime) {
//         if (this.isTransitioning) {
//             this.fadeOpacity += this.fadeSpeed;
//             if (this.fadeOpacity >= 1) {
//                 // Full black, time to switch scenes
//                 if (this.currentScene && this.currentScene.onExit) {
//                     this.currentScene.onExit();
//                 }
//                 this.currentScene = this.nextScene;
//                 this.nextScene = null;
//                 if (this.currentScene && this.currentScene.onEnter) {
//                     this.currentScene.onEnter();
//                 }
//             }
//         } else if (this.fadeOpacity > 0) {
//             this.fadeOpacity -= this.fadeSpeed; // fade back out
//         }
//
//         if (this.currentScene && !this.isTransitioning) {
//             this.currentScene.update(deltaTime);
//         }
//     }
//
//     draw(ctx) {
//         if (this.currentScene) {
//             this.currentScene.draw(ctx);
//         }
//
//         if (this.fadeOpacity > 0) {
//             ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeOpacity})`;
//             ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//         }
//     }
// }
