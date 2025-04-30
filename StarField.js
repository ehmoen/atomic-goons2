import {rand, rgbaColor} from "./engine/utils.js";

const NEAR_Z = 5;
const FAR_Z = 2000;
const FOCAL_LENGHT = 600;
const VELOCITY_Z = 4;

export class StarField {
    constructor(game) {
        this.game = game;
        this.stars = [];
        this.numStars = 256;
        this.createStars();
    }

    createStars() {
        console.log("createStars");
        for (let i = 0; i < this.numStars; i++) {
            const star = {
                x: -this.game.engine.width / 2 + rand(this.game.engine.width - 1),
                y: -this.game.engine.height / 2 + rand(this.game.engine.height - 1),
                z: NEAR_Z + rand(FAR_Z - NEAR_Z - 1),
                color: "white"
            }
            this.stars.push(star);
        }
    }

    update() {
        for (let i = 0; i < this.numStars; i++) {
            this.stars[i].z -= VELOCITY_Z;

            if (this.stars[i].z <= NEAR_Z) {
                this.stars[i].z = FAR_Z;
            }
        }
    }

    draw(context) {
        for (let i = 0; i < this.numStars; i++) {
            const xPerspective = FOCAL_LENGHT * this.stars[i].x / this.stars[i].z;
            const yPerspective = FOCAL_LENGHT * this.stars[i].y / this.stars[i].z;
            const xScreen = this.game.engine.width / 2 + xPerspective;
            const yScreen = this.game.engine.height / 2 - yPerspective;

            if (!(xScreen >= this.game.engine.width || xScreen < 0 || yScreen >= this.game.engine.height || yScreen < 0)) {
                const intensity = (255 - 255 * (this.stars[i].z / (4 * FAR_Z)));
                const starScale = 1 - (this.stars[i].z / (FAR_Z - NEAR_Z));
                context.beginPath();
                context.fillStyle = rgbaColor(intensity, intensity, intensity);
                context.arc(xScreen, yScreen, starScale + 1, 0, Math.PI * 2);
                context.fill();
                context.closePath();
                context.restore();
            }
        }
    }
}