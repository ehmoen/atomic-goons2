export default class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressed = {}; // was the key just pressed once?
        this.mouse = {
            x: 0,
            y: 0,
            clicked: false
        };

        window.addEventListener("mousedown", (e) => {
            this.mouse.clicked = true;
        });

        window.addEventListener("mouseup", (e) => {
            this.mouse.clicked = false;
        });

        window.addEventListener("mousemove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    listenForEvents() {
        window.addEventListener("keydown", (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true; // key was just pressed!
            }
            this.keys[e.code] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.code] = false;
            this.justPressed[e.code] = false; // reset when released
        });
    }

    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    wasPressedOnce(keyCode) {
        if (this.justPressed[keyCode]) {
            this.justPressed[keyCode] = false; // consume it
            return true;
        }
        return false;
    }

    reset() {
        this.keys = {};
        this.justPressed = {};
    }
    
    
}
