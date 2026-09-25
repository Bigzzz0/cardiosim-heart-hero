// Synthesized UI/ambience cues, deliberately not diagnostic recordings.
export type AudioCue = 'tool-pickup' | 'tool-contact' | 'auscultation' | 'success' | 'error';
export class AudioSystem {
  private context: AudioContext | null = null;
  private gain: GainNode | null = null;
  private nextBeat = 0;
  muted = true;
  volume = .22;
  async toggle() {
    if (!this.context) {
      this.context = new AudioContext(); this.gain = this.context.createGain(); this.gain.connect(this.context.destination);
    }
    await this.context.resume(); this.muted = !this.muted; this.setVolume(this.volume);
  }
  setVolume(value: number) { this.volume = Math.max(0, Math.min(1, value)); if (this.gain) this.gain.gain.value = this.muted ? 0 : this.volume; }
  private tone(frequency: number, duration: number, delay = 0) {
    if (!this.context || !this.gain || this.muted) return;
    const at = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator(); const envelope = this.context.createGain();
    oscillator.frequency.value = frequency; envelope.gain.setValueAtTime(.001, at); envelope.gain.exponentialRampToValueAtTime(.18, at + .008); envelope.gain.exponentialRampToValueAtTime(.001, at + duration);
    oscillator.connect(envelope); envelope.connect(this.gain); oscillator.start(at); oscillator.stop(at + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  cue(kind: AudioCue) {
    if (kind === 'tool-pickup') { this.tone(430, .045); return; }
    if (kind === 'tool-contact') { this.tone(560, .035); return; }
    if (kind === 'auscultation') { for (let i = 0; i < 12; i++) this.tone(120 + ((i * 71) % 170), .06, i * .075); }
    else { this.tone(kind === 'error' ? 180 : 700, .12); if (kind !== 'error') this.tone(920, .12, .13); }
  }
  update(delta: number, hr: number | null, alarm: boolean) {
    this.nextBeat -= delta;
    if (this.nextBeat > 0) return;
    this.nextBeat = alarm ? 1100 : hr ? 60000 / hr : 60000;
    if (hr !== null || alarm) this.tone(alarm ? 780 : 640, .07);
    if (alarm) this.tone(620, .10, .18);
  }
  dispose() { void this.context?.close(); this.context = null; }
}
