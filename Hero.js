import {Vector2D} from "./engine/Vector2D.js";
import {Projectile} from "./Projectile.js";
import PhysicsBody from "./engine/PhysicsBody.js";
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
        
        this.angle = 0;
        this.thrust = new Vector2D(0, 0);
        this.thrusting = false;
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
            
            //this.thrust.setLength(-1);
        }
        if (input.isPressed("ArrowRight") || input.isPressed("d")) {
            this.body.acceleration.x = 1;
            this.body.velocity.x = speed;
            //this.thrust.setLength(1);
        }
        // if (input.isPressed("ArrowUp" || input.isPressed("w"))) {
        //     this.thrusting = true;
        // } else {
        //     this.thrusting = false;
        // }
        //
        // this.thrust.setAngle(this.angle);
        // if (this.thrusting) {
        //     this.thrust.setLength(0.05);
        // } else {
        //     this.thrust.setLength(0);
        // }
        //
        //this.body.acceleration = this.thrust;

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
        //  context.save();
        // context.translate(this.body.position.x, this.body.position.y);
        // context.rotate(Math.PI);
        context.drawImage(this.img, this.body.position.x, this.body.position.y, this.img.width, this.img.height);//,  -this.body.width / 2, -this.body.height / 2, this.body.width, this.body.height);
        //context.fillStyle = "red";
        //context.fillRect(this.body.position.x, this.body.position.y, this.body.width, this.body.height);
        
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

        //context.restore();

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