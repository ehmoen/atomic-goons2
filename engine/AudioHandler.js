export class AudioHandler {
    constructor() {
        this.sounds = {};
        this.currentMusic = null;
    }

    load(audioFiles) {
        for (const [key, path] of Object.entries(audioFiles)) {
            const audio = new Audio(path);
            audio.preload = "auto";
            this.sounds[key] = audio;
        }
    }

    play(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0; // rewind if it was already playing
            sound.play();
        }
    }

    playMusic(name, fadeDuration = 2000) {
        const newMusic = this.sounds[name];
        
        if (!newMusic) {
            return;
        }

        newMusic.loop = true;
        newMusic.volume = 0;
        newMusic.currentTime = 0;
        newMusic.play();

        if (this.currentMusic && this.currentMusic !== newMusic) {
            this.fadeOut(this.currentMusic, fadeDuration);
        }

        this.fadeIn(newMusic, fadeDuration);
        this.currentMusic = newMusic;
    }

    stopMusic(fadeDuration = 2000) {
        if (this.currentMusic) {
            this.fadeOut(this.currentMusic, fadeDuration);
            this.currentMusic = null;
        }
    }
    
    fadeIn(audio, duration) {
        const step = 0.01;
        const interval = duration / (1 / step);
        audio.volume = 0;

        const fade = setInterval(() => {
            if (audio.volume < 1) {
                audio.volume = Math.min(audio.volume + step, 1);
            } else {
                clearInterval(fade);
            }
        }, interval);
    }

    fadeOut(audio, duration) {
        const step = 0.01;
        const interval = duration / (1 / step);

        const fade = setInterval(() => {
            if (audio.volume > 0) {
                audio.volume = Math.max(audio.volume - step, 0);
            } else {
                audio.pause();
                clearInterval(fade);
            }
        }, interval);
    }
}