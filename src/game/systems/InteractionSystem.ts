import type { MedicalTool, MissionDefinition, Objective } from '../types';
export type Resolution = { valid: true; objective: Objective } | { valid: false; feedback: string; duplicate?: boolean };
export class InteractionResolver {
  preview(tool: MedicalTool | undefined, target: string, mission: MissionDefinition, completed: ReadonlySet<string>): Resolution {
    if (!tool) return { valid: false, feedback: 'เลือกเครื่องมือจาก Toolbar ก่อนเริ่มตรวจ' };
    if (!tool.allowedTargets.includes(target)) return { valid: false, feedback: '✕ เครื่องมือนี้ไม่เหมาะกับบริเวณที่เลือก ลองตำแหน่งอื่นได้' };
    const objective = mission.objectives?.find(item => item.tool === tool.id && item.target === target);
    if (!objective) return { valid: false, feedback: '✕ การตรวจนี้ไม่อยู่ในภารกิจปัจจุบัน ดูรายการประเมินแล้วลองใหม่' };
    if (completed.has(objective.id)) return { valid: false, duplicate: true, feedback: 'บันทึกการตรวจนี้แล้ว ตรวจรายการที่เหลือต่อได้เลย' };
    if (mission.ordered && mission.objectives?.find(item => !completed.has(item.id))?.id !== objective.id) return { valid: false, feedback: '✕ ประเมินตามลำดับใน Checklist ก่อน แล้วลองใหม่ได้' };
    return { valid: true, objective };
  }
  resolve(tool: MedicalTool | undefined, target: string, mission: MissionDefinition, completed: ReadonlySet<string>): Resolution {
    return this.preview(tool, target, mission, completed);
  }
}
export class InteractionSystem {
  readonly resolver = new InteractionResolver();
  pending: { objective: Objective; remaining: number; total: number } | null = null;
  start(objective: Objective, duration: number) { this.pending = { objective, remaining: duration, total: duration }; }
  update(delta: number): Objective | null {
    if (!this.pending) return null;
    this.pending.remaining -= delta;
    if (this.pending.remaining > 0) return null;
    const result = this.pending.objective; this.pending = null; return result;
  }
}
