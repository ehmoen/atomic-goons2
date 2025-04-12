export class AudioControl {
    constructor(){
        this.fxExplosion = document.getElementById("fxExplosion");
        this.songGoonsInAction = document.getElementById("songGoonsInAction");
        this.songMainTheme = document.getElementById("songMainTheme");
    }
    play(audio){
        audio.currentTime = 0;
        audio.play();
    }
}