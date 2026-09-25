// A deliberately schematic trace. It is not a clinical ECG or diagnostic strip.
export class MonitorSystem {
  phase = 0;
  update(delta: number, hr: number | null) { if (hr !== null) this.phase = (this.phase + delta * hr / 60000) % 1; }
  waveform(width = 220): string {
    const points: string[] = [];
    const pulse = (x: number, center: number, spread: number, amplitude: number) => amplitude * Math.exp(-((x - center) ** 2) / spread);
    for (let x = 0; x <= width; x += 2) {
      const t = ((x / width * 2.5 - this.phase) % 1 + 1) % 1;
      const y = 34 - pulse(t, .17, .0015, 4) + pulse(t, .31, .0003, 5) - pulse(t, .35, .0002, 26) + pulse(t, .40, .0003, 15) - pulse(t, .64, .004, 7);
      points.push(`${x ? 'L' : 'M'}${x} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  }
}
