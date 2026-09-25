import type { GameEvent } from '../types';

export class EventBus {
  private listeners = new Set<(event: GameEvent) => void>();
  readonly logs: GameEvent[] = [];
  subscribe(listener: (event: GameEvent) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  emit(event: GameEvent) {
    this.logs.unshift(event);
    this.logs.splice(40);
    for (const listener of this.listeners) listener(event);
  }
  clear() { this.listeners.clear(); this.logs.length = 0; }
}
