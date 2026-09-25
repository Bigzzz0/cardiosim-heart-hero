import React from 'react';
import { ClipboardCheck, Monitor } from 'lucide-react';
import type { DecisionPresentation } from '../types';

interface InRoomDecisionSurfaceProps {
  presentation: DecisionPresentation;
  missionTitle: string;
  instruction: string;
  children: React.ReactNode;
}

const surfaceDetails: Record<DecisionPresentation, { label: string; title: string }> = {
  'bedside-clipboard': { label: 'BEDSIDE WORKSPACE', title: 'แฟ้มข้างเตียง' },
  'monitor-response': { label: 'PATIENT MONITOR', title: 'แผงตอบสนองฉุกเฉิน' },
};

export function InRoomDecisionSurface({ presentation, missionTitle, instruction, children }: InRoomDecisionSurfaceProps) {
  const detail = surfaceDetails[presentation];
  const Icon = presentation === 'bedside-clipboard' ? ClipboardCheck : Monitor;
  return <section className={`in-room-decision-surface surface-${presentation}`} data-room-surface={presentation}>
    <header className="surface-hardware">
      <span className="surface-icon"><Icon size={17}/></span>
      <span className="surface-heading"><small>{detail.label}</small><b>{detail.title}</b></span>
      <span className="surface-status"><i/>พร้อมใช้งาน</span>
    </header>
    <div className="surface-instruction"><b>{missionTitle.replace('\n', ' ')}</b><span>{instruction}</span></div>
    <div className="surface-content">{children}</div>
  </section>;
}
