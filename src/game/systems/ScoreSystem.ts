import type { GameCase, ScoreData } from '../types';
export class ScoreSystem {
  data: ScoreData = { mistakeCount: 0, hintCount: 0, attempts: 0, completionTime: null };
  constructor(private config: GameCase['scoring']) {}
  attempt(valid: boolean) { this.data.attempts++; if (!valid) this.data.mistakeCount++; }
  hint() { this.data.hintCount++; }
  get total() { return Math.max(0, this.config.initial - this.data.mistakeCount * this.config.mistakePenalty - this.data.hintCount * this.config.hintPenalty); }
}
