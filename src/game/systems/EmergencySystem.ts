import type { MissionEffect } from '../types';
export class EmergencySystem {
  started = false;
  alarm = false;
  elapsed = 0;
  resolved = false;
  apply(effect: MissionEffect) {
    if (effect.emergency) this.started = true;
    if (effect.alarm !== undefined) { this.alarm = effect.alarm; if (!effect.alarm && this.started) this.resolved = true; }
  }
  update(delta: number) { if (this.started && !this.resolved) this.elapsed += delta; }
}
