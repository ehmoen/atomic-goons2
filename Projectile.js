import {Particle} from "./engine/Particle.js";

export class Projectile extends Particle {
    constructor(game, x, y, angle) {
        super(x, y, 0, 0, 0, 1);//x, y, speed, direction, gravity = 0, friction
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.width = 6;
        this.height = 6;
        this.speed = 10;
        this.markedForDeletion = false;
    }

    update() {
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;

        if (this.position.x > this.game.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.fillStyle = "#f2b934";
        context.fillRect(this.position.x + Math.cos(this.angle), this.position.y + Math.sin(this.angle), this.width, this.height);
    }
}