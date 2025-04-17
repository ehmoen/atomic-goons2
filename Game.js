import {InputHandler} from "./InputHandler.js";
import {UI} from "./UI.js";
import {StarField} from "./StarField.js";
import {Player} from "./Player.js";
import {AtomicGoon} from "./AtomicGoon.js";
import {AudioControl} from "./AudioControl.js";

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.background = new StarField(this);
        this.player = new Player(this);
        
        this.input = new InputHandler(this);
        this.keys = [];
        this.mouse = {
            x: undefined,
            y: undefined,
            width: 1,
            height: 1,
            pressed: false,
            fired: false
        };
        
        this.soundOn = true;
        this.sound = new AudioControl();
        this.ui = new UI(this);
        
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        
        this.ammo = 50;
        this.maxAmmo = 100;
        this.ammoTimer = 0;
        this.ammoInterval = 250;

        this.score = 0;
        this.winningScore = 10;
        this.gameTime = 0;
        this.timeLimit = 50000;

        this.gameOver = true;
        this.paused = false;

        this.resize(window.innerWidth, window.innerHeight);
        
        /*===================================================
         EventListeners
        ===================================================*/
        window.addEventListener('resize', e => {
            this.resize(e.target.innerWidth, e.target.innerHeight);
        });
        
        window.addEventListener('mousedown', e => {
            //debugger
            if(this.gameOver && !this.paused) {
                this.start();
            } else if (!this.paused) {
                this.pause();
            } else {
                this.paused = false;
                this.gameOver = false;
                this.sound.songGoonsInAction.play();
            }
        });
    }

    start(){
        if(this.soundOn){
            this.sound.songMainTheme.pause();
            this.sound.songMainTheme.currentTime = 0;
            this.sound.songGoonsInAction.play();
        }
        
        this.resize(window.innerWidth, window.innerHeight);
        this.ammo = 50;
        this.score = 0;
        this.lives = 3;
        this.player = new Player(this);
        this.gameTime = 0;
        this.gameOver = false;
        this.enemies = [];
        this.enemies.forEach(enemy => {
            enemy.markedForDeletion = false;
        });
    }

    pause() {
        this.sound.songGoonsInAction.pause();
        this.sound.songMainTheme.pause();
        this.gameOver = true;
        this.paused = true;
    }
    
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
    }

    update(deltaTime) {

        if(!this.gameOver) {
            this.gameTime += deltaTime;

            if (this.gameTime > this.timeLimit) {
                this.gameOver = true;
                this.sound.songGoonsInAction.pause();
                this.sound.songGoonsInAction.currentTime = 0;
                this.sound.songMainTheme.play();
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

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        } else {

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

    // triggerGameOver(){
    //     if (!this.gameOver){
    //         this.gameOver = true;
    //         if (this.lives < 1){
    //             this.message1 = 'Game Over!';
    //             this.message2 = 'xxxx!';
    //         } else if (this.score >= this.winningScore){
    //             this.message1 = 'Well done!';
    //             this.message2 = 'You escaped the swarm!';
    //         }
    //     }
    // }
    // drawStatusText(){
    //     this.ctx.save();
    //     this.ctx.textAlign = 'left';
    //     this.ctx.fillText('Score: ' + this.score, 20, 40);
    //     for (let i = 0; i < this.lives; i++){
    //         this.ctx.fillRect(20 + 15 * i, 60, 10, 25);
    //     }
    //     if (this.lives < 1 || this.score >= this.winningScore){
    //         this.triggerGameOver();
    //     }
    //     if (this.gameOver){
    //         this.ctx.textAlign = 'center';
    //         this.ctx.font = '80px Bangers';
    //         this.ctx.fillText(this.message1, this.width * 0.5, this.height * 0.5 - 25);
    //         this.ctx.font = '20px Bangers';
    //         this.ctx.fillText(this.message2, this.width * 0.5, this.height * 0.5 + 25);
    //         this.ctx.fillText(this.message3, this.width * 0.5, this.height * 0.5 + 50);
    //     }
    //     this.ctx.restore();
    // }
}