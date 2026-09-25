import type { MedicalTool } from '../types';
export class ToolSystem {
  selected: string | null = null;
  dragging = false;
  constructor(readonly definitions: MedicalTool[]) {}
  select(id: string | null) {
    if (id !== null && !this.definitions.some(tool => tool.id === id)) return false;
    this.dragging = false;
    this.selected = this.selected === id ? null : id;
    return true;
  }
  beginDrag(id: string) {
    if (!this.definitions.some(tool => tool.id === id)) return false;
    this.selected = id;
    this.dragging = true;
    return true;
  }
  endDrag() { this.dragging = false; this.selected = null; }
  get(id: string) { return this.definitions.find(tool => tool.id === id); }
}
