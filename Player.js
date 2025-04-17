import {Particle} from "./engine/Particle.js";
import {Vector2D} from "./engine/Vector2D.js";
import {Projectile} from "./Projectile.js";

export class Player extends Particle {
    constructor(game) {
        super(400, 40, 0, 0, 0, 0.99);//x, y, speed, direction, gravity = 0
        this.game = game;
        this.width = 30;
        this.height = 30;
        this.angle = 0;
        this.thrust = new Vector2D(0, 0);
        this.turningLeft = false;
        this.turningRight = false;
        this.thrusting = false;
        this.photonTorpedos = [];
        this.img = document.createElement("img");
        this.img.src = "./sprites/ship.png";
    }

    update() {
        if (this.game.keys.includes("ArrowLeft") || this.game.keys.includes("a")) {
            this.angle -= 0.03;
        } else if (this.game.keys.includes("ArrowRight") || this.game.keys.includes("d")) {
            this.angle += 0.03;
        } else if (this.game.keys.includes("ArrowUp") || this.game.keys.includes("w")) {
            this.thrusting = true;
        } else {
            this.thrusting = false;
        }

        this.thrust.setAngle(this.angle);
         if(this.thrusting) {
            this.thrust.setLength(0.05);
        }
        else {
            this.thrust.setLength(0);
        }

        this.accelerate(this.thrust);

        // handle projectiles
        this.photonTorpedos.forEach((pt) => {
            pt.update();
        });

        this.photonTorpedos = this.photonTorpedos.filter((pt) => !pt.markedForDeletion);
    }

    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }   

        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle);
        context.drawImage(this.img, 0, 0, this.img.width, this.img.height, -this.width / 2, -this.height / 2, this.width, this.height);

        if(this.thrusting) {
            context.beginPath();
            context.fillStyle = "red";
            context.strokeStyle = "red";
            context.moveTo(-25, 5);
            context.lineTo(-10,5);
            context.moveTo(-25, -5);
            context.lineTo(-10,-5);
            context.stroke();
        }

        context.restore();

        this.photonTorpedos.forEach((pt) => {
            pt.draw(context);
        });
    }

    shootTop() {
        if (this.game.ammo > 0) {
            //const pt = new Projectile(this.game, this.x + this.width, this.y + this.height / 2);
            const pt = new Projectile(this.game, this.position.x, this.position.y, this.angle);
            this.photonTorpedos.push(pt);
            this.game.ammo--;
        }
    }
}