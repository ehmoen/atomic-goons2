import {randomRange} from "./engine/utils.js";

const NEAR_Z = 5;
const FAR_Z = 2000;
const FOCAL_LENGHT = 600;
const VELOCITY_Z = 4;

export class AtomicGoon {
    constructor(game) {
        this.game = game;
        // this.x = -this.game.width / 2 + rand(this.game.width - 1);
        // this.y = -this.game.height / 2 + rand(this.game.height - 1);
        // this.z = NEAR_Z + rand(FAR_Z - NEAR_Z - 1);
        
        this.x = randomRange(-this.game.width / 2, this.game.width / 2);
        this.y = randomRange(-this.game.height / 2, this.game.height / 2);
        this.z = randomRange(NEAR_Z, FAR_Z); 
        
        this.markedForDeletion = false;
        this.lives = 1;
        this.score = this.lives;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 20;
        this.width = 70;
        this.height = 70;
        this.img = document.createElement("img");
        this.img.src = "./assets/sprites/goon.png";


        this.isExploding = false;
        this.frameExplodeX = 0;
        this.frameExplodeY = 0;
        this.maxFrameExplode = 70;
        this.widthExp = 100;
        this.heightExp = 100;
        this.imgExplode = document.createElement("img");
        this.imgExplode.src = "./assets/sprites/evil-goon.png";

        this.xScreen = 0;
        this.yScreen = 0;
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

        if (this.xScreen + this.width < 0) {
            this.markedForDeletion = true;
        }

        // sprite animation
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else {
            this.frameX = 0;
        }

        this.z -= VELOCITY_Z;
        if (this.z <= NEAR_Z) {
            this.z = FAR_Z;
        }
    }

    draw(context) {
        const xPerspective = FOCAL_LENGHT * this.x / this.z;
        const yPerspective = FOCAL_LENGHT * this.y / this.z;
        this.xScreen = this.game.width / 2 + xPerspective;
        this.yScreen = this.game.height / 2 + yPerspective;
        const scale = 50 - (50 * this.z / (2000 - 50));

        // if (this.game.debug) {
        //     context.strokeRect(this.xScreen, this.yScreen,  this.width / scale, this.height / scale);
        // }

        if (!this.isExploding && !(this.xScreen >= this.game.width || this.xScreen < 0 || this.yScreen >= this.game.height || this.yScreen < 0)) {

            context.drawImage(this.img, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.xScreen, this.yScreen, scale, scale);
        }

        if (this.isExploding) {
            context.drawImage(this.imgExplode, this.frameExplodeX * this.widthExp, this.frameExplodeY * this.heightExp, this.widthExp, this.heightExp, this.xScreen, this.yScreen, scale, scale);
        }
    }
}