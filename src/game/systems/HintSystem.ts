import type { MissionDefinition } from '../types';
export class HintSystem {
  visible = false;
  reveal(mission: MissionDefinition) { this.visible = true; return mission.hint; }
  reset() { this.visible = false; }
}
