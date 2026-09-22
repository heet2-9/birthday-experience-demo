class SoundFXManager {
  private bgAudioElement: HTMLAudioElement | null = null;
  private musicVolume: number = 0.8;

  constructor() {
    if (typeof window !== "undefined") {
      const savedMusic = localStorage.getItem("birthday_music_vol");
      if (savedMusic !== null) this.musicVolume = parseFloat(savedMusic);
    }
  }

  public registerBackgroundMusic(audio: HTMLAudioElement) {
    this.bgAudioElement = audio;
    this.applyVolumes();
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("birthday_music_vol", this.musicVolume.toString());
    }
    this.applyVolumes();
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  private applyVolumes() {
    if (this.bgAudioElement) {
      this.bgAudioElement.volume = this.musicVolume;
    }
  }
}

export const soundFX = new SoundFXManager();