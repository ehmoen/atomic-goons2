import Atoms from "./Atoms.js";

export default class Goons extends Atoms{
    constructor(game) {
        super(game);

        this.lives = 1;
        this.score = this.lives;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.width = 70;
        this.height = 70;
     
        this.img = document.createElement("img");
        this.img.src = "./assets/sprites/evilGoon.png";

        this.isExploding = false;
        this.frameExplodeX = 0;
        this.frameExplodeY = 0;
        this.maxFrameExplode = 70;
        this.widthExp = 100;
        this.heightExp = 100;
        this.imgExplode = document.createElement("img");
        this.imgExplode.src = "./assets/sprites/evil-goon.png";
    }
}