export default class PhysicsManager {
    constructor() {
        this.bodies = [];
    }

    add(body) {
        this.bodies.push(body);
    }

    clear() {
        this.bodies = [];
    }

    update(deltaTime) {
        for (const body of this.bodies) {
            body.update(deltaTime);
        }

        // Collision detection
        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                const a = this.bodies[i];
                const b = this.bodies[j];

                if (a.isCollidingWith(b)) {
                    // Simple collision response (stop on floor)
                    a.onGround = true;

                    // You could also trigger custom callbacks here
                    // like `a.onCollision(b);`
                }
            }
        }
    }
}
