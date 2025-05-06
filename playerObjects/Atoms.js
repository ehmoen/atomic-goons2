import {randomRange} from "../engine/utils.js";
import PhysicsBody from "../engine/PhysicsBody.js";

const NEAR_Z = 5;
const FAR_Z = 2000;
const FOCAL_LENGHT = 600;
const VELOCITY_Z = 4;

export default class Atoms {
    constructor(game) {
        this.game = game;
        this.body = new PhysicsBody(0, 0, 70, 70, { 
            gravity: 10,
            friction: 1,
            maxSpeed: 0
        });
        this.isGoon = false;
        
        this.body.position.x = 0;
        this.body.position.y = 0;
        
        this.markedForDeletion = false;
        // this.lives = 1;
        // this.score = this.lives;
        // this.frameX = 0;
        // this.frameY = 0;
        // this.maxFrame = 19;
        // this.width = 70;
        // this.height = 70;
        // this.img = document.createElement("img");
        // this.img.src = "./assets/sprites/goon.png";
        //
        // this.isExploding = false;
        // this.frameExplodeX = 0;
        // this.frameExplodeY = 0;
        // this.maxFrameExplode = 70;
        // this.widthExp = 100;
        // this.heightExp = 100;
        // this.imgExplode = document.createElement("img");
        // this.imgExplode.src = "./assets/sprites/evil-goon.png";

        this.body.position.x = 0;
        this.body.position.y = 0;
    }

    update() {
        if (this.isExploding) {
            if (this.frameExplodeX < this.maxFrameExplode) {
                this.frameExplodeX++;
            } else {
                this.isExploding = false;
                this.markedForDeletion = true;
            }
        }

        // if (this.body.position.x + this.width < 0 || 
        //     this.body.position.x > this.game.engine.width || 
        //     this.body.position.y + this.height < 0 || 
        //     this.body.position.y > this.game.engine.height) {
        //     this.markedForDeletion = true;
        // }

        // sprite animation
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }
        //
        // this.z -= VELOCITY_Z;
        // if (this.z <= NEAR_Z) {
        //     this.z = FAR_Z;
        // }
    }

    draw(context) {
        const xPerspective = FOCAL_LENGHT * this.drawX / this.z;
        const yPerspective = FOCAL_LENGHT * this.drawY / this.z;
        this.body.position.x = this.game.engine.width / 2 + xPerspective;
        this.body.position.y = this.game.engine.height / 2 + yPerspective;
        const scale = 50 - (50 * this.z / (2000 - 50));

        
        // if (this.game.engine.debug) {
        // context.strokeRect(this.body.position.x, this.body.position.y,  this.body.width, this.body.height);
        // }

        if (!this.isExploding && !(this.body.position.x >= this.game.engine.width || this.body.position.x < 0 || this.body.position.y >= this.game.engine.height || this.body.position.y < 0)) {

            context.drawImage(this.img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.body.position.x, this.body.position.y, scale, scale);
        }

        if (this.isExploding) {
            context.drawImage(this.imgExplode, this.frameExplodeX * this.widthExp, this.frameExplodeY * this.heightExp, this.widthExp, this.heightExp, this.body.position.x, this.body.position.y, scale, scale);
        }
    }
}