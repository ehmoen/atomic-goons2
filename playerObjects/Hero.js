import {Vector2D} from "../engine/Vector2D.js";
import {Projectile} from "./Projectile.js";
import PhysicsBody from "../engine/PhysicsBody.js";
export class Hero {
    constructor(game, x, y) {
        this.game = game;
        this.body = new PhysicsBody(x, y, 64, 64, { 
            gravity: 0, 
            friction: 0.9, 
            maxSpeed: 10000
        });
        
        this.ammo = 1000;
        this.maxAmmo = 1000;
        this.ammoTimer = 0;
        this.ammoInterval = 0.2;
        this.photonTorpedos = [];
        this.img = document.createElement("img");
        this.img.src = "./assets/sprites/ship2.png";
    }

    update(deltaTime, input) {
        let speed = 300;
        
        if (input.isPressed("Space") || input.isPressed(" ")) {
            this.shoot();
        }
        
        if (input.isPressed("ArrowUp")) {
            speed = speed * 3;
        } else{
            speed = 300;
        }
        
        if (input.isPressed("ArrowLeft") || input.isPressed("a")) {
            this.body.acceleration.x = -1;
            this.body.velocity.x = -speed;
        }
        
        if (input.isPressed("ArrowRight") || input.isPressed("d")) {
            this.body.acceleration.x = 1;
            this.body.velocity.x = speed;
        }

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
        context.drawImage(this.img, this.body.position.x, this.body.position.y, this.img.width, this.img.height);//,  -this.body.width / 2, -this.body.height / 2, this.body.width, this.body.height);

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