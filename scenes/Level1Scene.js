import GameOverScene from "./GameOverScene.js";
import Scene from "../engine/Scene.js";
import UIText from "../UIText.js";
import {StarField} from "../StarField.js";
// import {Player} from "../Player.js";
// import Atoms from "../Atoms.js";
import UIHealthBar from "../engine/UIHealthBar.js";
import GoodAtom from "../playerObjects/GoodAtom.js";
import Goons from "../playerObjects/Goons.js";
import {Hero} from "../playerObjects/Hero.js";
import BadAtom from "../playerObjects/BadAtom.js";
import Meteor from "../playerObjects/Meteor.js";
import {Player} from "../playerObjects/Player.js";
export default class Level1Scene extends Scene {
    constructor(sceneManager) {
        super(sceneManager);
        this.score = 0;

        this.background = new StarField(this);
        this.player = new Player(sceneManager.engine, sceneManager.engine.canvas.width / 2, sceneManager.engine.canvas.height - 50);
        this.playerHealth = 10;
        this.playerMaxHealth = 10;

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 0.9;



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
            this.sceneManager.engine.canvas.width - 250, 20,              // x, y
            200, 20,             // width, height
            () => this.playerHealth,   // function that returns current health
            () => this.playerMaxHealth, // function that returns max health
            {
                backgroundColor: "red",
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
            enemy.update(deltaTime);
            this.player.photonTorpedos.forEach((pt) => {
                // if (enemy.z < 1000 && this.checkPhotonTorpedoCollision(pt, enemy)) {
                if (pt.body.isCollidingWith(enemy)) {
                    this.engine.audio.playSound("explosion");
                    enemy.isExploding = true;
                    pt.markedForDeletion = true;
                    this.score += enemy.score;
                }
            });
            if (this.player.body.isCollidingWith(enemy)) {
                this.engine.audio.playSound("explosion");
                enemy.isExploding = true;
                console.log(this.playerHealth)
                this.playerHealth -= 3 * deltaTime;
                if (this.playerHealth <= 0) {
                    this.sceneManager.changeScene(new GameOverScene(this.sceneManager));
                }
                this.score -= enemy.score;
            }
        });

        if (this.enemyTimer > this.enemyInterval) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }

        // // Test health decrease (for demo)
        // this.playerHealth -= deltaTime * 10;
        // if (this.playerHealth < 0) {
        //     this.playerHealth = this.playerMaxHealth;
        // }
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
        this.enemies.push(new BadAtom(this));
        this.enemies.push(new Meteor(this));
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
