import GameEngine from "./engine/GameEngine.js";
import IntroScene from "./scenes/IntroScene.js";

window.addEventListener("load", () => {
    const canvas = document.getElementById("gameCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new GameEngine(canvas);

    game.audio.load("shoot", "assets/sounds/fx-shoot.mp3", true);
    game.audio.load("loose", "assets/sounds/fx-loose.mp3");
    game.audio.load("tickTack", "assets/sounds/fx-tick-tack.mp3");
    game.audio.load("explosion", "assets/sounds/fx-explosion.mp3");
    game.audio.load("mainTheme", "assets/sounds/song-main-theme.mp3");
    game.audio.load("goonsInAction", "assets/sounds/song-goons-in-action.mp3");

    const introScene = new IntroScene(game.sceneManager);
    game.start(introScene);
});