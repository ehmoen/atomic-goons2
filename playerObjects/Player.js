import {Vector2D} from "../engine/Vector2D.js";
import {Projectile} from "./Projectile.js";
import PhysicsBody from "../engine/PhysicsBody.js";
export class Player {
    constructor(game, x, y) {
        this.game = game;
        this.body = new PhysicsBody(x, y, 32, 32, { 
            gravity: 0, 
            friction: 0.99, 
            maxSpeed: 300
        });
        
        this.ammo = 50;
        this.maxAmmo = 100;
        this.ammoTimer = 0;
        this.ammoInterval = 0.2;
        
        this.angle = 0;
        this.thrust = new Vector2D(0, 0);
        this.thrusting = false;
        this.photonTorpedos = [];
        this.img = document.createElement("img");
        this.img.src = "./assets/sprites/ship.png";
    }

    update(deltaTime, input) {
        if (input.isPressed("Space") || input.wasPressedOnce(" ")) {
            this.shoot();
        }
        if (input.isPressed("ArrowLeft") || input.isPressed("a")) {
            this.angle -= 0.04;
        }
        if (input.isPressed("ArrowRight") || input.isPressed("d")) {
            this.angle += 0.04;
        }
        if (input.isPressed("ArrowUp" || input.isPressed("w"))) {
            this.thrusting = true;
        } else {
            this.thrusting = false;
        }

        this.thrust.setAngle(this.angle);
        if (this.thrusting) {
            this.thrust.setLength(300);
        } else {
            this.thrust.setLength(0);
        }

        this.body.acceleration = this.thrust;

        // handle projectiles
        this.photonTorpedos.forEach((pt) => {
            pt.update();
        });

        this.photonTorpedos = this.photonTorpedos.filter((pt) => !pt.markedForDeletion);

        if (this.ammoTimer > this.ammoInterval) {
            if (this.ammo < this.maxAmmo) {
                this.ammo++;
                this.ammoTimer = 0;
            }
        } else {
            this.ammoTimer += deltaTime;
        }
        
        this.body.update(deltaTime);
    }

    draw(context) {
        context.save();
        context.translate(this.body.position.x, this.body.position.y);
        context.rotate(this.angle);
        context.drawImage(this.img, 0, 0, this.img.width, this.img.height, -this.body.width / 2, -this.body.height / 2, this.body.width, this.body.height);
        
        if (this.thrusting) {
            context.beginPath();
            context.fillStyle = "red";
            context.strokeStyle = "red";
            context.moveTo(-25, 5);
            context.lineTo(-10, 5);
            context.moveTo(-25, -5);
            context.lineTo(-10, -5);
            context.stroke();
        }

        context.restore();

        this.photonTorpedos.forEach((pt) => {
            pt.draw(context);
        });

        

    }

    shoot() {
        if (this.ammo > 0) {
            const pt = new Projectile(this.game, this.body.position.x, this.body.position.y, this.angle);
            this.photonTorpedos.push(pt);
            this.ammo--;
        }
    }
}