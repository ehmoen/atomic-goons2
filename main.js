import {Game} from "./Game.js";

let deferredPrompt;

function handleOrientation() {
    const overlay = document.getElementById('rotateOverlay');
    const isPortrait = window.innerHeight > window.innerWidth;
    overlay.style.display = isPortrait ? 'block' : 'none';
}

window.addEventListener('resize', handleOrientation);
window.addEventListener('orientationchange', handleOrientation);
//window.addEventListener('load', handleOrientation);

// Handle PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installPrompt').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('Service Worker registered');
        });
    });
}

window.addEventListener("load", () => {

    handleOrientation();
    
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(canvas, ctx);
    let lastTime = 0;

    function run(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(run);
    }

    requestAnimationFrame(run);
});