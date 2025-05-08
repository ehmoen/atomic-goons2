import PhysicsBody from "../engine/PhysicsBody.js";

export class Projectile {
    constructor(game, x, y, angle) {
        this.game = game;
        this.body = new PhysicsBody(x, y, 6, 6, {
            gravity: 0,
            friction: 1,
            maxSpeed: 0
        });

        this.angle = angle;
        this.speed = 20;
        this.markedForDeletion = false;
    }

    update() {
        //this.body.position.y -= this.speed;
        this.body.position.x += Math.cos(this.angle) * this.speed;
        this.body.position.y += Math.sin(this.angle) * this.speed;

        if (this.body.position.x > this.game.width || 
            this.body.position.x < 0 || 
            this.body.position.y > this.game.height || 
            this.body.position.y < 0) {
            this.markedForDeletion = true;
        }        
    }

    draw(context) {
        context.fillStyle = "#f2b934";
        //context.fillRect(this.body.position.x, this.body.position.y, this.body.width, this.body.height);
        context.fillRect(this.body.position.x + Math.cos(this.angle), this.body.position.y + Math.sin(this.angle), this.body.width, this.body.height);
    }
}