export default class Animator {
    constructor(frameCount, frameRate) {
        this.frame = 0;
        this.frameCount = frameCount;
        this.frameRate = frameRate; // frames per second
        this.timer = 0;
    }

    update(deltaTime) {
        this.timer += deltaTime;
        if (this.timer > 1 / this.frameRate) {
            this.frame = (this.frame + 1) % this.frameCount;
            this.timer = 0;
        }
    }

    getCurrentFrame() {
        return this.frame;
    }
}
