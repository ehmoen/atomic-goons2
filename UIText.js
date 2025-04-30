export default class UIText {
    constructor(x, y, text, font = "24px 'Press Start 2P'", color = "#EDA236FF", align = "left") {
        this.x = x;
        this.y = y;
        this.text = text;
        this.font = font;
        this.color = color;
        this.align = align;
    }

    update(deltaTime) {
        // Animate text here
    }

    draw(ctx) {
        ctx.save();
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
