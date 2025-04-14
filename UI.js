export class UI {
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