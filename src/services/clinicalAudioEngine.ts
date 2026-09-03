// Clinical Web Audio Synthesizer for CardioSim
// Uses native Web Audio API to create authentic medical sound effects without external assets

class ClinicalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7; // 0.0 - 1.0
  private alarmInterval: number | null = null;
  private auscultationListeners: ((type: 'crepitation' | 's3' | 'stop') => void)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.4, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume * 0.4, this.ctx.currentTime);
    }
    if (muted && this.alarmInterval) {
      this.stopAlarm();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public onAuscultation(callback: (type: 'crepitation' | 's3' | 'stop') => void) {
    this.auscultationListeners.push(callback);
    return () => {
      this.auscultationListeners = this.auscultationListeners.filter(cb => cb !== callback);
    };
  }

  private notifyAuscultation(type: 'crepitation' | 's3' | 'stop') {
    this.auscultationListeners.forEach(cb => cb(type));
  }

  // 1. Monitor Heart Beep
  public playHeartBeep(freq = 880, duration = 0.08) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 2. High-Priority ICU Crisis Alarm (Two-Tone Pulse)
  public startAlarm() {
    if (this.isMuted || this.alarmInterval) return;
    this.initContext();

    const beep = () => {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Tone 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(960, now);
      gain1.gain.setValueAtTime(0.5, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Tone 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(740, now + 0.15);
      gain2.gain.setValueAtTime(0.5, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.28);
    };

    beep();
    this.alarmInterval = window.setInterval(beep, 600);
  }

  public stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  // 3. Fine Crepitation (Lung Crackles)
  public playCrepitationSound() {
    this.notifyAuscultation('crepitation');
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate random crackle bursts
      for (let i = 0; i < bufferSize; i++) {
        // sporadic popping crackles
        if (Math.random() < 0.02) {
          data[i] = (Math.random() * 2 - 1) * 0.8;
        } else {
          data[i] = (Math.random() * 2 - 1) * 0.02; // faint air sound
        }
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 2.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      noise.stop(this.ctx.currentTime + 2.0);
    } catch (e) {
      console.warn('Crepitation audio error:', e);
    }
  }

  // 4. Cardiac S3 Gallop Sound
  public playS3GallopSound() {
    this.notifyAuscultation('s3');
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // S1 sound (lub)
      this.createLowThud(now, 80, 0.12, 0.6);
      // S2 sound (dub)
      this.createLowThud(now + 0.25, 95, 0.1, 0.5);
      // S3 sound (gallop thud)
      this.createLowThud(now + 0.42, 65, 0.14, 0.45);
    } catch (e) {
      console.warn('S3 sound error:', e);
    }
  }

  private createLowThud(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + duration);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Success chime
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const time = this.ctx!.currentTime + idx * 0.1;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(time);
        osc.stop(time + 0.35);
      });
    } catch (e) {
      console.warn('Success chime error:', e);
    }
  }
}

export const clinicalAudio = new ClinicalAudioEngine();
