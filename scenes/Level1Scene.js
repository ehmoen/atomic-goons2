import GameOverScene from "./GameOverScene.js";
import Scene from "../engine/Scene.js";
import UIText from "../UIText.js";
import {StarField} from "../StarField.js";
import {Player} from "../Player.js";
import {AtomicGoon} from "../AtomicGoon.js";

export default class Level1Scene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
        this.score = 0;

        this.background = new StarField(this);
        this.player = new Player(this);

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 0.3;

        this.ammo = 50;
        this.maxAmmo = 100;
        this.ammoTimer = 0;
        this.ammoInterval = 0.2;

        this.score = 0;
        this.winningScore = 10;
        this.gameTime = 0;
        this.timeLimit = 60000;
    }

    onEnter() {
        this.scoreText = new UIText(20, 40, "Score: 0");
        this.ammoMeter = new UIText(20, 80, "Ammo: " + this.ammo);
        this.sceneManager.engine.ui.addElement(this.scoreText);
        this.sceneManager.engine.audio.playMusic("goonsInAction", true);
    }

    update(deltaTime) {
        if (this.sceneManager.engine.input.wasPressedOnce("Escape")) {
            this.sceneManager.changeScene(new GameOverScene(this.sceneManager));
        }

        this.scoreText.text = "Score: " + this.score;

        if(this.gameTime > this.timeLimit) {

        }

        this.gameTime += deltaTime;

        if (this.gameTime > this.timeLimit) {

        } else {

        }

        this.background.update();
        this.player.update();

        if (this.ammoTimer > this.ammoInterval) {
            if (this.ammo < this.maxAmmo) {
                this.ammo++;
                this.ammoTimer = 0;
            }
        } else {
            this.ammoTimer += deltaTime;
        }

        this.enemies.forEach((enemy) => {
            enemy.update();
            this.player.photonTorpedos.forEach((pt) => {
                if (enemy.z < 1000 && this.checkPhotonTorpedoCollision(pt, enemy)) {
                    this.engine.audio.playSound("explosion");
                    enemy.isExploding = true;
                    pt.markedForDeletion = true;
                    this.score += enemy.score;
                }
            })
        });

        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
    }

    draw(ctx) {
        this.background.draw(ctx);

        this.enemies.forEach((enemy) => {
            if (enemy.markedForDeletion) {
                this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
            } else {
                enemy.draw(ctx);
            }
        });
        
        this.player.draw(ctx);

        // ammo
        for (let i = 0; i < this.ammo; i++) {
            ctx.fillStyle = "red";
            ctx.fillRect(20 + 5 * i, 50, 3, 20);
        }
    }

    addEnemy() {
        this.enemies.push(new AtomicGoon(this));
    }

    checkPhotonTorpedoCollision(photonTorpedo, atomicGoon) {
        const xPT = photonTorpedo.position.x + Math.cos(photonTorpedo.angle);
        const yPT = photonTorpedo.position.y + Math.sin(photonTorpedo.angle);
        const xGoon = atomicGoon.xScreen;
        const yGoon = atomicGoon.yScreen;

        return xPT < xGoon + atomicGoon.width / 2 &&
            yPT < yGoon + atomicGoon.height / 2 &&
            xPT + photonTorpedo.width / 2 > xGoon &&
            yPT + photonTorpedo.height / 2 > yGoon;
    }
    
    onExit() {
        this.sceneManager.engine.ui.clear(); // clean up UI
    }
}
