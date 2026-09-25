import React from 'react';
import { Activity, ClipboardList, Pill } from 'lucide-react';
import type { ActivityPresentation } from '../types';

interface InRoomActivitySurfaceProps {
  presentation: ActivityPresentation;
  missionTitle: string;
  instruction: string;
  children: React.ReactNode;
}

const details: Record<ActivityPresentation, { label: string; title: string; icon: typeof Activity }> = {
  'medication-station': { label: 'MEDICATION PREP', title: 'สถานีเตรียมยา', icon: Pill },
  'io-board': { label: 'BEDSIDE CHART', title: 'บอร์ดบันทึก I/O', icon: ClipboardList },
  'ecg-console': { label: 'MONITOR REVIEW', title: 'จอทบทวน ECG', icon: Activity },
};

export function InRoomActivitySurface({ presentation, missionTitle, instruction, children }: InRoomActivitySurfaceProps) {
  const detail = details[presentation];
  const Icon = detail.icon;
  return <section className={`in-room-activity-surface activity-surface-${presentation}`} data-room-surface={presentation}>
    <header className="activity-surface-hardware">
      <span className="activity-surface-icon"><Icon size={18}/></span>
      <span><small>{detail.label}</small><b>{detail.title}</b></span>
      <i className="activity-surface-ready">READY</i>
    </header>
    <div className="activity-surface-instruction"><b>{missionTitle.replace('\n',' ')}</b><span>{instruction}</span></div>
    <div className="activity-surface-content">{children}</div>
  </section>;
}
