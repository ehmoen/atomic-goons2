export default class AudioManager {
    constructor() {
        this.tracks = new Map(); // Map of all loaded Audio elements
        this.currentMusic = null;
        this.volume = 1.0;
        this.muted = false;
    }

    load(name, src, loop = false) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.preload = "auto";
        audio.volume = this.volume;
        this.tracks.set(name, audio);
    }

    playMusic(name) {
        const track = this.tracks.get(name);
        if (!track) return;

        if (this.currentMusic && this.currentMusic !== track) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        this.currentMusic = track;
        if (!this.muted) {
            this.currentMusic.play();
        }
    }

    playSound(name) {
        const sound = this.tracks.get(name);
        if (!sound || this.muted) {
            return;
        }

        const clone = sound.cloneNode(); // so multiple can overlap
        clone.volume = this.volume;
        clone.play();
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

    setVolume(value) {
        this.volume = value;
        if (this.currentMusic) {
            this.currentMusic.volume = value;
        }
    }

    mute() {
        this.muted = true;
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    unmute() {
        this.muted = false;
        if (this.currentMusic) {
            this.currentMusic.play();
        }
    }

    toggleMute() {
        this.muted ? this.unmute() : this.mute();
    }
}
