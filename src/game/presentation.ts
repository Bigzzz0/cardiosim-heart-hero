import type { MissionDefinition } from './types';
import type { MissionPresentation } from './components/MissionPanel';

export function presentationFor(mission: MissionDefinition): MissionPresentation {
  if (mission.kind === 'summary') return 'result';
  if (mission.kind === 'intro') return 'briefing';
  if (mission.kind === 'placement') return 'procedure';
  if (mission.kind === 'interaction' || mission.kind === 'transition') return 'field';
  if (mission.decision?.presentation === 'bedside-clipboard') return 'bedside-clipboard';
  if (mission.decision?.presentation === 'monitor-response') return 'monitor-response';
  if (mission.kind === 'decision' && mission.activity?.presentation) return mission.activity.presentation;
  if (mission.kind === 'decision' && (!mission.activity || mission.activity.kind === 'matching')) return 'decision-board';
  return 'worksheet';
}
export function primaryActionFor(mission: MissionDefinition, confirmed: boolean, ecgConfirmed: boolean) {
  const presentation = presentationFor(mission);
  const owner = mission.kind === 'summary' ? 'none' : presentation === 'procedure' ? 'procedure' : 'panel';
  const label = mission.kind === 'decision'
    ? confirmed ? 'ต่อไป' : mission.activity?.allowMissingDataAcknowledgement ? 'บันทึกข้อมูลที่ขาด' : mission.activity?.presentation === 'medication-station' ? 'บันทึกการเตรียมยา' : mission.activity?.presentation === 'ecg-console' ? 'บันทึกการอ่าน ECG' : mission.activity?.kind === 'medication' || mission.activity?.kind === 'text-response' ? 'ยืนยันและบันทึก' : 'ยืนยันคำตอบ'
    : mission.kind === 'placement' ? ecgConfirmed ? (mission.button ?? 'บันทึก ECG') : 'ยืนยัน ECG' : mission.button ?? 'ต่อไป';
  return { owner, label } as const;
}
