import type { PatientState } from '../types';
export class PatientSystem {
  state: PatientState;
  constructor(initial: PatientState) { this.state = { ...initial }; }
  apply(patch: Partial<PatientState>) { this.state = { ...this.state, ...patch }; }
}
