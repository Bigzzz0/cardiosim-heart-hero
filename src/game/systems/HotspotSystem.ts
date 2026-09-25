import type { Hotspot, Point } from '../types';
export class HotspotSystem {
  constructor(readonly definitions: Hotspot[]) {}
  at(point: Point) { return this.definitions.find(target => Math.hypot(target.x - point.x, target.y - point.y) <= target.radius); }
}
