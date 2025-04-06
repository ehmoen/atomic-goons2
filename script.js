import { rand, rgbaColor } from "./utils.js";
window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.height = 500;
    canvas.width = 500;

    const NEAR_Z = 5;
    const FAR_Z = 2000;
    const FOCAL_LENGHT = 600;
    const VELOCITY_Z = 4;

    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        addTo(v) {
            this.x += v.x;
            this.y += v.y;
        }

        subtractFrom(v) {
            this.x -= v.x;
            this.y -= v.y;
        }

        multiplyBy(scalar) {
            this.x *= scalar;
            this.y *= scalar;
        }

        divideBy(scalar) {
            this.x /= scalar;
            this.y /= scalar;
        }

        setAngle(angle) {
            const length = this.getLength();
            this.x = Math.cos(angle) * length;
            this.y = Math.sin(angle) * length;
        }

        getAngle(){
            return Math.atan2(this.y, this.x);
        }

        setLength(length) {
            const angle = this.getAngle();
            this.x = Math.cos(angle) * length;
            this.y = Math.sin(angle) * length;
        }

        getLength() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        normalize() {
            const len = this.getLength();
            if (len === 0) return new Vector(0, 0);
            return new Vector(this.x / len, this.y / len);
        }
    }

    class Particle {
        constructor(x, y, speed, direction, gravity, friction) {
            this.position = new Vector(x, y);
            this.velocity = new Vector(0, 0);
            this.velocity.setLength(speed); // magnitude
            this.velocity.setAngle(direction); // angle
            this.gravity = new Vector(0, gravity);
            this.friction = friction;
        }

        accelerate(acceleration) {
            this.velocity.multiplyBy(this.friction);
            this.velocity.addTo(acceleration);
            this.position.addTo(this.velocity);
        }

        update() {
            this.velocity.addTo(this.gravity);
            this.position.addTo(this.velocity);
        }
    }
    
    class InputHandler {
        constructor(game) { 
            this.game = game;
            window.addEventListener("keydown", (e) => {
                if ((e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp") && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === " ") {
                    this.game.player.shootTop();
                } else if (e.key === "d") {
                    this.game.debug = !this.game.debug;
                }
            });

            window.addEventListener("keyup", (e) => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            });

        }
    }

    class Projectile extends Particle {
        constructor(game, x, y, angle) {
            super(x, y, 0, 0, 0, 1);//x, y, speed, direction, gravity = 0, friction
            this.game = game;
            this.x = x;
            this.y = y;
            this.angle = angle;
            this.width = 4;
            this.height = 4;
            this.speed = 10;
            this.markedForDeletion = false;
        }

        update() {
            this.position.x += Math.cos(this.angle) * this.speed;
            this.position.y += Math.sin(this.angle) * this.speed;

            if (this.position.x > this.game.width) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            context.fillStyle = "red";
            context.fillRect(this.position.x + Math.cos(this.angle), this.position.y + Math.sin(this.angle), this.width, this.height);
        }
    }

    class Player extends Particle {
        constructor(game) {
            super(100, 100, 0, 0, 0, 0.99);//x, y, speed, direction, gravity = 0
            this.game = game;
            this.width = 30;
            this.height = 30;
            this.angle = 0;
            this.thrust = new Vector(0, 0);
            this.turningLeft = false;
            this.turningRight = false;
            this.thrusting = false;
            this.photonTorpedos = [];
            this.img = document.createElement("img");
            this.img.src = "./sprites/ship.png";
        }

        update() {
            if (this.game.keys.includes("ArrowLeft")) {
                this.angle -= 0.03;
            } else if (this.game.keys.includes("ArrowRight")) {
                this.angle += 0.03;
            } else if (this.game.keys.includes("ArrowUp")) {
                this.thrusting = true; 
            } else {
                this.thrusting = false;
            }

            this.thrust.setAngle(this.angle);

            if(this.thrusting) {
                this.thrust.setLength(0.05);
            }
            else {
                this.thrust.setLength(0);
            }

            this.accelerate(this.thrust);

            // handle projectiles
            this.photonTorpedos.forEach((pt) => {
                pt.update();
            });

            this.photonTorpedos = this.photonTorpedos.filter((pt) => !pt.markedForDeletion);

            // TODO: sprite animation
            // if (this.frameX < this.maxFrame) {
            //     this.frameX++;
            // } else {
            //     this.frameX = 0;
            // }
        }

        draw(context) {
            if (this.game.debug) {
                context.strokeRect(this.x, this.y, this.width, this.height);
            }

            context.save();
            context.translate(this.position.x, this.position.y);
            context.rotate(this.angle);
            context.drawImage(this.img, 0, 0, this.img.width, this.img.height, -this.width / 2, -this.height / 2, this.width, this.height);

            if(this.thrusting) {
                context.beginPath();
                context.fillStyle = "red";
                context.strokeStyle = "red";
                context.moveTo(-25, 5);
                context.lineTo(-10,5);
                context.moveTo(-25, -5);
                context.lineTo(-10,-5);
                context.stroke();
            }

            context.restore();

            this.photonTorpedos.forEach((pt) => {
                pt.draw(context);
            });
        }

        shootTop() {
            if (this.game.ammo > 0) {
                //const pt = new Projectile(this.game, this.x + this.width, this.y + this.height / 2);
                const pt = new Projectile(this.game, this.position.x, this.position.y, this.angle);
                this.photonTorpedos.push(pt);
                this.game.ammo--;  
            }

        }
    }
    
    class AtomicGoon {
        constructor(game) {
            this.game = game;
            this.x = -this.game.width / 2 + rand(this.game.width - 1);
            this.y = -this.game.height / 2 + rand(this.game.height - 1);
            this.z = NEAR_Z + rand(FAR_Z - NEAR_Z - 1);
            this.markedForDeletion = false;
            this.lives = 1;
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 20;
            this.width = 70;
            this.height = 70;
            this.img = document.createElement("img");
            this.img.src = "./sprites/goon.png";


            this.isExploding = false;
            this.frameExplodeX = 0;
            this.frameExplodeY = 0;
            this.maxFrameExplode = 70;
            this.widthExp = 100;
            this.heightExp = 100;
            this.imgExplode = document.createElement("img");
            this.imgExplode.src = "./sprites/evil-goon.png";
            
            this.xScreen = 0;
            this.yScreen = 0;
        }

        update() {
            if(this.isExploding) {
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
            this.yScreen = this.game.height / 2 - yPerspective;
            const scale = 50 - (50 * this.z / (2000 - 50));
            
            // if (this.game.debug) {
            //     context.strokeRect(this.xScreen, this.yScreen,  this.width / scale, this.height / scale);
            // }
            
            if (!this.isExploding && 
                !(this.xScreen >= this.game.width || 
                  this.xScreen < 0 || 
                  this.yScreen >= this.game.height || 
                  this.yScreen < 0)) {
                
                context.drawImage(
                    this.img,
                    this.frameX * this.width,
                    this.frameY * this.height,
                    this.width,
                    this.height,
                    this.xScreen,
                    this.yScreen,
                    scale,
                    scale);
            }

            if(this.isExploding) {
                context.drawImage(
                    this.imgExplode,
                    this.frameExplodeX * this.widthExp,
                    this.frameExplodeY * this.heightExp,
                    this.widthExp,
                    this.heightExp,
                    this.xScreen,
                    this.yScreen,
                    scale,
                    scale);
            }
        }
    }

    class StarField {
        constructor(game) {
            this.game = game;
            this.stars = [];
            this.numStars = 256;
            this.createStars();
        }

        createStars() {
            for (let i = 0; i < this.numStars; i++) {
                const star = {
                    x: -this.game.width / 2 + rand(this.game.width - 1),
                    y: -this.game.height / 2 + rand(this.game.height - 1),
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
                const xScreen = this.game.width / 2 + xPerspective;
                const yScreen = this.game.height / 2 - yPerspective;

                if (!(xScreen >= this.game.width || xScreen < 0 || yScreen >= this.game.height || yScreen < 0)) {
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

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = "Helvetica";
            this.color = "white";
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = "black";
            context.font = this.fontSize + "px " + this.fontFamily;

            // score
            context.fillText(`Score: ${this.game.score}`, 20, 20);


            // number of goons
            const numOfGoons = this.game.enemies.length;
            context.fillText("Goons: #" + numOfGoons, 150, 20);

            // timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText("Time: " + formattedTime, this.game.width - 130, 20);

            // ammo
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillStyle = "red";
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }

            // game over message
            if (this.game.gameOver) {

                let message1;
                let message2;
                if (this.game.score < this.game.winningScore) {
                    message1 = "You Win!";
                    message2 = "You rock!";
                } else {
                    message1 = "G A M E  O V E R";
                    message2 = "PRESS F5 TO PLAY AGAIN";
                }
                context.fillStyle = this.color;
                context.textAlign = "center";
                context.font = "50px " + this.fontFamily;
                context.fillText(message1, this.game.width / 2, this.game.height / 2 - 40);
                context.font = "25px " + this.fontFamily;
                context.fillText(message2, this.game.width / 2, this.game.height / 2 + 40);
            }

            context.restore();
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new StarField(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
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

            // sounds ------------------------------------------------
            this.soundTrack = new Audio();
            this.goonsInAction = new Audio();
            this.goonsInAction.loop = true;
            this.goonsInAction.src = './sounds/song-goons-in-action.mp3';

            this.theme = new Audio();
            this.theme.loop = true;
            this.theme.src = './sounds/song-main-theme.mp3';

            this.shoot = new Audio();
            this.shoot.src = './sounds/fx-shoot-short.mp3';

            this.loose = new Audio();
            this.loose.src = './sounds/fx-loose.mp3';
        }

        update(deltaTime) {
            if (!this.gameOver) {
                this.gameTime += deltaTime;
                this.goonsInAction.play();
                this.theme.pause();
            }

            if (this.gameTime > this.timeLimit) {
                this.gameOver = true;
                this.goonsInAction.pause();
                this.theme.play();
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
                    if (this.checkPhotonTorpedoCollision(pt, enemy)) {
                        // TODO: Refactor this
                        if(this.shoot.duration > 0 && !this.shoot.paused){
                            //already playing
                            this.shoot.pause();
                            this.shoot.currentTime = 0;
                            this.shoot.play();

                        }else{
                            this.shoot.play();
                        }
                        
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
                if(enemy.markedForDeletion){
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
                   xPT + photonTorpedo.width / 2 > xGoon &&
                   yPT < yGoon + atomicGoon.height / 2 &&
                   yPT + photonTorpedo.height / 2 > yGoon;
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);

});