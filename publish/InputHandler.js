export class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener("keydown", (e) => {
            if ((e.key === "ArrowLeft" || e.key === "a" || 
                e.key === "ArrowRight" || e.key === "d" || 
                e.key === "ArrowUp" || e.key === "w") && this.game.keys.indexOf(e.key) === -1) {
                this.game.keys.push(e.key);
            } else if (e.key === "p" || e.key === " ") {
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

        // window.addEventListener("mousedown", (e) => {
        //     this.game.mouse.x = e.x;
        //     this.game.mouse.y = e.y;
        //     //console.log(e);
        // })
    }
}