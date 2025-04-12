import {InputHandler} from "./InputHandler.js";
import {UI} from "./UI.js";
import {StarField} from "./StarField.js";
import {Player} from "./Player.js";
import {AtomicGoon} from "./AtomicGoon.js";
import {AudioControl} from "./AudioControl.js";

export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.background = new StarField(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.keys = [];
        this.sound = new AudioControl();
        this.ui = new UI(this);
        this.mouse = {x: undefined, y: undefined, pressed: false};
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.ammo = 20;
        this.maxAmmo = 50;
        this.ammoTimer = 0;
        this.ammoInterval = 500;
        this.gameOver = false;
        this.score = 0;
        this.winningScore = 10;
        this.gameTime = 0;
        this.timeLimit = 50000;
        this.speed = 1;
        this.debug = true;
        
        // GUI ------------------------------------------------
        this.resetButton = document.getElementById("resetButton");
        this.resetButton.addEventListener("click", () => {
            this.start();
        });
        
        this.fullScreenButton = document.getElementById("fullScreenButton");
        this.fullScreenButton.addEventListener("click", () => {
            this.pause();
        });

        window.addEventListener("resize", (e) => {
            this.resize(window.innerWidth, window.innerHeight);
        });

        // sounds ------------------------------------------------
        // this.soundTrack = new Audio();
        // this.goonsInAction = new Audio();
        // this.goonsInAction.loop = true;
        // this.goonsInAction.src = './sounds/song-goons-in-action.mp3';
        //
        // this.theme = new Audio();
        // this.theme.loop = true;
        // this.theme.src = './sounds/song-main-theme.mp3';
        //
        // this.shoot = new Audio();
        // this.shoot.src = './sounds/fx-shoot-short.mp3';
        //
        // this.loose = new Audio();
        // this.loose.src = './sounds/fx-loose.mp3';
    }

    resize(width, height) {
        canvas.width = width;
        canvas.height = height;
        this.width = width;
        this.height = height;
    }

    start() {
        if (!this.gameOver) {
            //this.sound.play(this.sound.songGoonsInAction);
            this.sound.songGoonsInAction.play();
            //this.theme.pause();
        } else {
            // this.goonsInAction.pause();
            this.sound.songMainTheme.play();
        }
    }

    pause() {
        this.gameOver = true;
        // this.theme.pause();
        // this.goonsInAction.pause();
    }

    update(deltaTime) {
        if (!this.gameOver) {
            this.gameTime += deltaTime;
        }

        if (this.gameTime > this.timeLimit) {
            this.gameOver = true;
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
                    this.sound.play(this.sound.fxExplosion);

                    enemy.isExploding = true;
                    pt.markedForDeletion = true;
                    this.score += enemy.score;
                }
            })
        });

        //this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

        if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
    }

    draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.ui.draw(context);

        this.enemies.forEach((enemy) => {
            if (enemy.markedForDeletion) {
                this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
            } else {
                enemy.draw(context);
            }
        });
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
}