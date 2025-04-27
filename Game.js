import {InputHandler} from "./InputHandler.js";
import {UI} from "./UI.js";
import {StarField} from "./StarField.js";
import {Player} from "./Player.js";
import {AtomicGoon} from "./AtomicGoon.js";
import {AudioHandler} from "./engine/AudioHandler.js";
import {GameState} from "./main.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;

        this.state = 0;

        this.background = new StarField(this);
        this.player = new Player(this);

        this.input = new InputHandler(this);
        this.keys = [];
        
        this.soundOn = true;
        this.audio = new AudioHandler();
        this.setupAudio(this.audio);
        
        this.ui = new UI(this);

        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 0.3;

        this.ammo = 50;
        this.maxAmmo = 100;
        this.ammoTimer = 0;
        this.ammoInterval = 0.2;

        this.finalScore = document.getElementById('finalScore');
        this.score = 0;
        this.winningScore = 10;
        this.gameTime = 0;
        this.timeLimit = 60; // in seconds

        this.paused = false;

        this.resize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', e => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        });
    }


    setupAudio(audio) {
        const audioFiles = {
            shoot: "assets/sounds/fx-shoot.mp3",
            loose: "assets/sounds/fx-loose.mp3",
            tickTack: "assets/sounds/fx-tick-tack.mp3",
            explosion: "./assets/sounds/fx-explosion.mp3",
            mainTheme: "./assets/sounds/song-main-theme.mp3",
            goonsInAction: "./assets/sounds/song-goons-in-action.mp3"
        };

        audio.load(audioFiles);
    }

    setState(newState) {
        this.state = newState;
        if(this.state === GameState.START) {
            this.reset();
        } else if(this.state === GameState.LEVEL1) {
            this.audio.playMusic("goonsInAction", 100);
        } else if(this.state === GameState.GAME_OVER) {
            this.audio.playMusic("mainTheme", 500);
        }
    }

    reset() {
        // if (this.soundOn) {
        //     // this.audio.stopMusic();
        //     this.audio.playMusic("goonsInAction");
        // }



        
        this.resize(window.innerWidth, window.innerHeight);
        this.ammo = 50;
        this.score = 0;
        this.lives = 3;
        this.player = new Player(this);
        this.gameTime = 0;

        this.enemies = [];
        this.enemies.forEach(enemy => {
            enemy.markedForDeletion = false;
        });
    }

    pause() {
        this.paused = true;
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }

    update(deltaTime) {
        switch (this.state) {
            case GameState.START:
                //this.reset();
                break;
            case GameState.LEVEL1:
                this.updateGameLevel1(deltaTime);
                break;
            case GameState.LEVEL2:
                break;
            case GameState.GAME_OVER:
                this.updateGameOver(deltaTime);
                break;
        }
    }

    draw(ctx) {
        switch (this.state) {
            case GameState.START:
                break;
            case GameState.LEVEL1:
                this.drawGameLevel1(ctx);
                break;
            case GameState.LEVEL2:
                break;
            case GameState.GAME_OVER:
                break;
        }
    }
    
    //
    // Game Level 1
    //
    updateGameLevel1(deltaTime) {
        
        if(this.gameTime > this.timeLimit) {
            let currentState = GameState.GAME_OVER;
            this.setState(currentState);
            document.getElementById('gameOver').style.display = "flex";
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
                    this.audio.play("explosion");
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

    drawGameLevel1(context) {
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
    
    
    //
    // Game Over
    //
    updateGameOver(deltaTime) {
        this.finalScore = document.getElementById('finalScore');
        this.finalScore.innerHTML = this.score;
    }

    drawGameOver(context) {


        
        
    }
}