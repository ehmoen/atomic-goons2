export default class UIHandler {
    constructor(engine) {
        this.engine = engine;

        this.elements = [];
    }

    addElement(element) {
        this.elements.push(element);
    }

    clear() {
        this.elements = [];
    }

    update(deltaTime) {
        for (const el of this.elements) {
            if (el.update) {
                el.update(deltaTime);
            }
        }
    }

    draw(ctx) {
        for (const el of this.elements) {
            if (el.draw) {
                el.draw(ctx);
            }
        }
    }
}
