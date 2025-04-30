export default class Scene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.engine = sceneManager.engine;
    }

    onEnter() {
        // Called when the scene starts
    }

    update(deltaTime) {
        // Called every frame
    }

    draw(ctx) {
        // Called every frame to draw
    }

    onExit() {
        // Called when leaving the scene
    }
}
