export class Vector2D {
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
        if (len === 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / len, this.y / len);
    }
}

