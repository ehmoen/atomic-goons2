import GameOverScene from "./GameOverScene.js";
import Scene from "../engine/Scene.js";
import UIText from "../UIText.js";
import {StarField} from "../StarField.js";
import {Player} from "../Player.js";
import Atoms from "../Atoms.js";
import UIHealthBar from "../engine/UIHealthBar.js";
import GoodAtom from "../GoodAtom.js";
import Goons from "../Goons.js";
export default class Level2Scene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
        this.score = 0;

        this.background = new StarField(this);
        this.player = new Player(sceneManager.engine, this.sceneManager.engine.width / 2, 10);
        this.playerHealth = 80;
        this.playerMaxHealth = 100;

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 0.3;



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

        const healthBar = new UIHealthBar(
            20, 200,              // x, y
            200, 20,             // width, height
            () => this.playerHealth,   // function that returns current health
            () => this.playerMaxHealth, // function that returns max health
            {
                backgroundColor: "darkred",
                fillColor: "green",
                borderColor: "black"
            }
        );

        this.sceneManager.engine.ui.addElement(healthBar);
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
        this.player.update(deltaTime, this.sceneManager.engine.input);



        this.enemies.forEach((enemy) => {
            enemy.update();
            this.player.photonTorpedos.forEach((pt) => {
                // if (enemy.z < 1000 && this.checkPhotonTorpedoCollision(pt, enemy)) {
                if (enemy.z < 1000 && pt.body.isCollidingWith(enemy)) {
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

        // Test health decrease (for demo)
        this.playerHealth -= deltaTime * 10;
        if (this.playerHealth < 0) {
            this.playerHealth = this.playerMaxHealth;
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
    }

    addEnemy() {
        this.enemies.push(new GoodAtom(this));
        this.enemies.push(new Goons(this));
    }

    // checkPhotonTorpedoCollision(photonTorpedo, atomicGoon) {
    //     const xPT = photonTorpedo.body.position.x + Math.cos(photonTorpedo.angle);
    //     const yPT = photonTorpedo.body.position.y + Math.sin(photonTorpedo.angle);
    //     const xGoon = atomicGoon.xScreen;
    //     const yGoon = atomicGoon.yScreen;
    //
    //     return xPT < xGoon + atomicGoon.width / 2 &&
    //         yPT < yGoon + atomicGoon.height / 2 &&
    //         xPT + photonTorpedo.width / 2 > xGoon &&
    //         yPT + photonTorpedo.height / 2 > yGoon;
    // }
    
    onExit() {
        this.sceneManager.engine.ui.clear(); // clean up UI
    }
}
