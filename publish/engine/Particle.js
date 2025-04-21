import { Vector2D } from './Vector2D.js';

export class Particle {
    constructor(x, y, speed, direction, gravity, friction) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.velocity.setLength(speed); // magnitude
        this.velocity.setAngle(direction); // angle
        this.gravity = new Vector2D(0, gravity);
        this.friction = friction;
    }

    accelerate(acceleration) {
        this.velocity.multiplyBy(this.friction);
        this.velocity.addTo(acceleration);
        this.position.addTo(this.velocity);
    }

    update() {
        this.velocity.addTo(this.gravity);
        this.position.addTo(this.velocity);
    }
}