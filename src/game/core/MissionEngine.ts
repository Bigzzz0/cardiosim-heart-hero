import type { MissionDefinition } from '../types';
export class MissionEngine {
  index = 0;
  completed = new Set<string>();
  decisions: string[] = [];
  decisionConfirmed = false;
  phaseElapsed = 0;
  constructor(readonly definitions: MissionDefinition[]) {}
  get current() { return this.definitions[this.index]; }
  interactionComplete() { return this.current.objectives?.every(item => this.completed.has(item.id)) ?? false; }
  validateDecision() {
    const answer = this.current.decision;
    if (!answer || this.decisions.length !== answer.expected.length) return false;
    if (answer.slots?.length) return answer.slots.every(slot => this.decisions.includes(`${slot.id}::${slot.expected}`));
    return answer.ordered ? answer.expected.every((id, index) => this.decisions[index] === id) : answer.expected.every(id => this.decisions.includes(id));
  }
  jumpTo(id: MissionDefinition['id']) {
    const index = this.definitions.findIndex(item => item.id === id);
    if (index < 0) return false;
    this.index = index; this.phaseElapsed = 0; this.decisions = []; this.decisionConfirmed = false; return true;
  }
  advance() {
    if (this.index >= this.definitions.length - 1) return false;
    this.index++; this.phaseElapsed = 0; this.decisions = []; this.decisionConfirmed = false; return true;
  }
}
