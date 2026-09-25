import type { VitalSigns } from '../types';
export class VitalSystem {
  current: VitalSigns;
  private start: VitalSigns;
  private target: VitalSigns;
  private elapsed = 0;
  private duration = 0;
  constructor(initial: VitalSigns) { this.current = { ...initial }; this.start = { ...initial }; this.target = { ...initial }; }
  transition(target: Partial<VitalSigns>, duration: number) {
    this.start = { ...this.current }; this.target = { ...this.current, ...target }; this.duration = duration; this.elapsed = 0;
    if (duration === 0) this.current = { ...this.target };
  }
  update(delta: number) {
    if (this.elapsed >= this.duration) return;
    this.elapsed = Math.min(this.elapsed + delta, this.duration);
    const t = this.elapsed / this.duration;
    const ease = t * t * (3 - 2 * t);
    for (const key of Object.keys(this.current) as (keyof VitalSigns)[]) {
      const from = this.start[key];
      const to = this.target[key];
      if (from !== null && to !== null) this.current[key] = from + (to - from) * ease;
    }
  }
}
