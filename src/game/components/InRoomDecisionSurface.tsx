import React from 'react';
import { ClipboardCheck, Monitor } from 'lucide-react';
import type { ChartEntry, DecisionPresentation } from '../types';

interface InRoomDecisionSurfaceProps {
  presentation: DecisionPresentation;
  missionTitle: string;
  instruction: string;
  findings: readonly ChartEntry[];
  children: React.ReactNode;
}

const surfaceDetails: Record<DecisionPresentation, { label: string; title: string }> = {
  'bedside-clipboard': { label: 'BEDSIDE WORKSPACE', title: 'แฟ้มข้างเตียง' },
  'monitor-response': { label: 'PATIENT MONITOR', title: 'แผงตอบสนองฉุกเฉิน' },
};

export function InRoomDecisionSurface({ presentation, missionTitle, instruction, findings, children }: InRoomDecisionSurfaceProps) {
  const detail = surfaceDetails[presentation];
  const Icon = presentation === 'bedside-clipboard' ? ClipboardCheck : Monitor;
  return <section className={`in-room-decision-surface surface-${presentation}`} data-room-surface={presentation}>
    <header className="surface-hardware">
      <span className="surface-icon"><Icon size={24}/></span>
      <div className="surface-instruction"><small>{detail.title}</small><b>{missionTitle.replace('\n', ' ')}</b></div>
      <details className="surface-guide"><summary aria-label="วิธีเล่นกิจกรรม">วิธีเล่น</summary><p>{instruction}</p></details>
    </header>
    {presentation==='bedside-clipboard'&&<details className="evidence-strip" aria-label="หลักฐานที่ค้นพบแล้ว"><summary>ข้อมูลจากการตรวจ · {findings.filter(f=>['History','Vital Signs','Respiratory Assessment','Perfusion Assessment'].includes(f.section)).length} รายการ</summary><div>{findings.filter(f=>['History','Vital Signs','Respiratory Assessment','Perfusion Assessment'].includes(f.section)).map(f=><span key={f.id} title={f.text}>{f.title}</span>)}</div></details>}
    <div className="surface-content">{children}</div>
  </section>;
}
