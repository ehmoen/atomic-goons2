export default class UIHealthBar {
    constructor(x, y, width, height, getHealthFunc, getMaxHealthFunc, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.getHealth = getHealthFunc;
        this.getMaxHealth = getMaxHealthFunc;

        // Optional settings
        this.backgroundColor = options.backgroundColor || "gray";
        this.fillColor = options.fillColor || "lime";
        this.borderColor = options.borderColor || "black";
        this.borderWidth = options.borderWidth || 2;
    }

    update(deltaTime) {
        // Nothing dynamic here unless you want animations
    }

    draw(ctx) {
        const maxHealth = this.getMaxHealth();
        const currentHealth = this.getHealth();
        const healthRatio = Math.max(0, currentHealth / maxHealth);

        // Draw background
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw fill
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width * healthRatio, this.height);

        // Border
        if (this.borderWidth > 0) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
