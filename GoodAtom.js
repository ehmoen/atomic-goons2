import {randomRange} from "./engine/utils.js";
import PhysicsBody from "./engine/PhysicsBody.js";
import Atoms from "./Atoms.js";

// const NEAR_Z = 5;
// const FAR_Z = 2000;
// const FOCAL_LENGHT = 600;
// const VELOCITY_Z = 4;

export default class GoodAtom extends Atoms{
    constructor(game) {
        super(game);
        //this.game = game;
        //this.body = new PhysicsBody(0, 0, 70, 70, 0, 0, { });
        // this.isGoon = false;
        //
        // this.drawX = randomRange(-this.game.engine.width / 2, this.game.engine.width / 2);
        // this.drawY = randomRange(-this.game.engine.height / 2, this.game.engine.height / 2);
        // this.z = randomRange(NEAR_Z, FAR_Z); 
        //
        //this.body.position.x = 0;
        //this.body.position.y = 0;
        
        //this.markedForDeletion = false;
        this.lives = 1;
        this.score = this.lives;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 19;
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

        //this.body.position.x = 0;
        //this.body.position.y = 0;
    }

}