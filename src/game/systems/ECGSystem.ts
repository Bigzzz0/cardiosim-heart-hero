import type { ECGTarget, Point } from '../types';
export class ECGSystem {
  placed = new Set<string>();
  selected: string | null = null;
  constructor(readonly targets: ECGTarget[]) {}
  place(id: string, point: Point) {
    const target = this.targets.find(item => item.id === id);
    if (!target || this.placed.has(id)) return null;
    const valid = Math.hypot(point.x - target.x, point.y - target.y) <= target.snapRadius;
    if (valid) { this.placed.add(id); this.selected = null; }
    return valid;
  }
  get complete() { return this.placed.size === this.targets.length; }
}
