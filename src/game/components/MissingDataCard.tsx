import React from 'react';
import { FileQuestion, ShieldAlert } from 'lucide-react';
import type { ActivityConfig } from '../types';

interface MissingDataCardProps {
  activity: ActivityConfig;
  acknowledged: boolean;
  onAcknowledge: () => void;
}

export function MissingDataCard({ activity, acknowledged, onAcknowledge }: MissingDataCardProps) {
  return <section className="missing-data-card">
    <div className="missing-data-title"><FileQuestion size={20}/><span><small>CASE FILE · SOURCE CHECK</small><b>ข้อมูลไม่ปรากฏในเรื่องย่อ</b></span></div>
    {activity.notice && <p><ShieldAlert size={15}/>{activity.notice}</p>}
    {activity.rows?.map(row => <div className="missing-data-row" key={row.label}><span>{row.label}</span><b>{row.value}</b></div>)}
    <button className={`missing-data-ack ${acknowledged ? 'acknowledged' : ''}`} type="button" onClick={onAcknowledge} aria-pressed={acknowledged}>
      <span>{acknowledged ? '✓' : '□'}</span>{acknowledged ? 'บันทึกแล้วว่าไม่มีข้อมูล' : 'บันทึกว่าไม่มีข้อมูลใน Case'}
    </button>
  </section>;
}
