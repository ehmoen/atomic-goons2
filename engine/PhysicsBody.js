import { Vector2D } from './Vector2D.js';
export default class PhysicsBody {
    constructor(x, y, width, height, options = {}) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.acceleration = new Vector2D(0, 0);
        
        // this.velocity.setLength(speed); // magnitude
        // this.velocity.setAngle(direction); // angle
        

        this.width = width;
        this.height = height;

        this.gravity = options.gravity ?? 0;  // e.g. 500 for downward gravity
        this.friction = options.friction ?? 0.99;
        this.maxSpeed = options.maxSpeed ?? Infinity;

        this.onGround = false; // set by collision logic
        this.isStatic = options.isStatic ?? false; // static = does not move
    }

    // accelerate(acceleration) {
    //     this.velocity.multiplyBy(this.friction);
    //     this.velocity.addTo(acceleration);
    //     this.position.addTo(this.velocity);
    // }
    
    update(deltaTime) {
        if (this.isStatic) return;

        // Apply gravity
        this.velocity.y += this.gravity * deltaTime;

        // Apply acceleration
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        // this.velocity.multiplyBy(this.friction);
        // this.velocity.addTo(this.acceleration);
        // this.position.addTo(this.velocity);
        
        // Apply friction (to horizontal movement)
        this.velocity.x *= this.friction;

        // Clamp max speed
        this.velocity.x = Math.max(-this.maxSpeed, Math.min(this.velocity.x, this.maxSpeed));
        this.velocity.y = Math.max(-this.maxSpeed, Math.min(this.velocity.y, this.maxSpeed));

        // Update position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    getAABB() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        };
    }

    // Axis-Aligned Bounding Box collision
    isCollidingWith(otherBody) {
        const a = this.getAABB();
        const b = otherBody.body.getAABB();
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}

/*

export default class PhysicsBody {
    constructor(x, y, width, height, options = {}) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };

        this.width = width;
        this.height = height;

        this.gravity = options.gravity ?? 0;  // e.g. 500 for downward gravity
        this.friction = options.friction ?? 0.9;
        this.maxSpeed = options.maxSpeed ?? Infinity;

        this.onGround = false; // set by collision logic
        this.isStatic = options.isStatic ?? false; // static = does not move
    }

    update(deltaTime) {
        if (this.isStatic) return;

        // Apply gravity
        this.velocity.y += this.gravity * deltaTime;

        // Apply acceleration
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        // Apply friction (to horizontal movement)
        this.velocity.x *= this.friction;

        // Clamp max speed
        this.velocity.x = Math.max(-this.maxSpeed, Math.min(this.velocity.x, this.maxSpeed));
        this.velocity.y = Math.max(-this.maxSpeed, Math.min(this.velocity.y, this.maxSpeed));

        // Update position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    getAABB() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height
        };
    }

    // Axis-Aligned Bounding Box collision
    isCollidingWith(otherBody) {
        const a = this.getAABB();
        const b = otherBody.getAABB();
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}

 */